import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

export type TestDataValidator<T> = (value: unknown, sourcePath: string) => T;

type JsonRecord = Record<string, unknown>;

const DATA_ROOT = resolve(__dirname);

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertInsideDataRoot(filePath: string, sourcePath: string): void {
  const pathFromRoot = relative(DATA_ROOT, filePath);
  if (pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot)) {
    throw new Error(`[TestData] JSON reference escapes test-data/: ${sourcePath}`);
  }
}

async function readJson(filePath: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as unknown;
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown read error';
    throw new Error(`[TestData] Cannot read or parse ${relative(DATA_ROOT, filePath)}: ${reason}`);
  }
}

function readJsonPointer(value: unknown, pointer: string, sourcePath: string): unknown {
  if (!pointer.startsWith('/')) {
    throw new Error(`[TestData] Invalid JSON pointer in ${sourcePath}: ${pointer}`);
  }

  return pointer.slice(1).split('/').reduce<unknown>((current, segment) => {
    const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
    if (Array.isArray(current) && /^\d+$/.test(key)) {
      return current[Number(key)];
    }
    if (isRecord(current)) {
      return current[key];
    }
    return undefined;
  }, value);
}

function getEnvironmentValue(environmentName: string, sourcePath: string): string {
  if (!/^[A-Z][A-Z0-9_]*$/.test(environmentName)) {
    throw new Error(`[TestData] Invalid environment variable name in ${sourcePath}: ${environmentName}`);
  }

  const environmentValue = process.env[environmentName]?.trim();
  if (!environmentValue || /^REPLACE_WITH|^__.*__$|^<.*>$/i.test(environmentValue)) {
    throw new Error(
      `[TestData] Missing required value ${environmentName} (referenced by ${sourcePath}). ` +
      'Set it in the local .env file or test runner environment; placeholder values are not accepted.'
    );
  }

  return environmentValue;
}

async function resolveReferences(
  value: unknown,
  currentFile: string,
  seenReferences: ReadonlySet<string>
): Promise<unknown> {
  const currentSource = relative(DATA_ROOT, currentFile);

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => resolveReferences(item, currentFile, seenReferences)));
  }
  if (!isRecord(value)) {
    return value;
  }

  if (Object.keys(value).length === 1 && typeof value.$ref === 'string') {
    const [referencedFile, pointer] = value.$ref.split('#', 2);
    const targetFile = referencedFile ? resolve(dirname(currentFile), referencedFile) : currentFile;
    assertInsideDataRoot(targetFile, currentSource);

    const referenceKey = `${targetFile}#${pointer ?? ''}`;
    if (seenReferences.has(referenceKey)) {
      throw new Error(`[TestData] Circular JSON reference detected: ${currentSource} -> ${value.$ref}`);
    }

    const targetDocument = await readJson(targetFile);
    const targetValue = pointer
      ? readJsonPointer(targetDocument, pointer, currentSource)
      : targetDocument;
    if (targetValue === undefined) {
      throw new Error(`[TestData] JSON reference not found in ${currentSource}: ${value.$ref}`);
    }

    const nextReferences = new Set(seenReferences);
    nextReferences.add(referenceKey);
    return resolveReferences(targetValue, targetFile, nextReferences);
  }

  const resolvedEntries = await Promise.all(
    Object.entries(value).map(async ([key, child]) => {
      if (key.endsWith('Env')) {
        if (typeof child !== 'string') {
          throw new Error(`[TestData] Environment reference must be a variable name: ${currentSource}.${key}`);
        }
        return [key.slice(0, -3), getEnvironmentValue(child, currentSource)] as const;
      }
      return [key, await resolveReferences(child, currentFile, seenReferences)] as const;
    })
  );
  return Object.fromEntries(resolvedEntries);
}

export async function loadTestData<T>(
  relativePath: string,
  validate: TestDataValidator<T>
): Promise<T> {
  const absolutePath = resolve(DATA_ROOT, relativePath);
  assertInsideDataRoot(absolutePath, relativePath);

  const parsed = await readJson(absolutePath);
  const resolved = await resolveReferences(parsed, absolutePath, new Set());
  return validate(resolved, relativePath);
}