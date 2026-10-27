import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localDir = join(root, '.tools', 'dotnet');
const localExe = join(localDir, process.platform === 'win32' ? 'dotnet.exe' : 'dotnet');
const useLocal = existsSync(localExe);
export const dotnetCommand = useLocal ? localExe : 'dotnet';
export const dotnetEnv = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: '1' };
if (useLocal) {
  dotnetEnv.DOTNET_ROOT = localDir;
  dotnetEnv.DOTNET_CLI_HOME = join(root, '.tools', 'dotnet-home');
  const pathKey = Object.keys(dotnetEnv).find((key) => key.toLowerCase() === 'path') || 'PATH';
  dotnetEnv[pathKey] =
    localDir + (process.platform === 'win32' ? ';' : ':') + (dotnetEnv[pathKey] || '');
}
