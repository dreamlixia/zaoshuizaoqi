import { exec } from 'child_process';

/**
 * 获取全局username
 * @returns {string} username
 */
export function getGitUsername(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('git config --global user.name', (error, stdout, stderr) => {
            if (error || stderr) {
                reject(error || stderr);
                return;
            }
            resolve(stdout.trim());
        });
    });
}