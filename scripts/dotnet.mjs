import { spawn } from 'node:child_process';
import { dotnetCommand, dotnetEnv, root } from './dotnet-runtime.mjs';

// Dùng SDK riêng nếu có; máy khác chỉ cần cài .NET 10 SDK thông thường.
const child = spawn(dotnetCommand, process.argv.slice(2), {
  cwd: root,
  env: dotnetEnv,
  stdio: 'inherit',
});
child.on('error', (error) => {
  console.error(`Không chạy được .NET SDK: ${error.message}. Cài .NET 10 SDK rồi thử lại.`);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
