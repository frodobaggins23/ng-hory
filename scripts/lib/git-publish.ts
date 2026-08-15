import { execFileSync } from 'child_process';

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf-8' }).trim();
}

/**
 * Refuses to proceed if the working tree isn't clean, so the wizard never mixes
 * its own commit with unrelated in-progress work.
 */
export function assertCleanWorkingTree(): void {
  const status = git(['status', '--porcelain']);
  if (status) {
    throw new Error(
      'Working tree has uncommitted changes. Commit or stash them before running add-activity.'
    );
  }
}

export function createBranch(branchName: string): void {
  git(['checkout', '-b', branchName]);
}

export function commitFiles(files: string[], message: string): void {
  git(['add', ...files]);
  git(['commit', '-m', message]);
}

export function pushBranch(branchName: string): void {
  git(['push', '-u', 'origin', branchName]);
}

function parseOwnerRepo(): { owner: string; repo: string } {
  const remoteUrl = git(['remote', 'get-url', 'origin']);
  const match = remoteUrl.match(/github\.com[:/]([^/]+)\/(.+?)(\.git)?$/);

  if (!match) {
    throw new Error(`Could not parse a GitHub owner/repo from remote: ${remoteUrl}`);
  }

  return { owner: match[1], repo: match[2] };
}

function githubApiHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

/**
 * Opens a draft PR for the pushed branch against the repo's default branch.
 */
export async function openDraftPullRequest(
  githubToken: string,
  branchName: string,
  title: string,
  body: string
): Promise<string> {
  const { owner, repo } = parseOwnerRepo();

  const repoInfoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: githubApiHeaders(githubToken),
  });

  if (!repoInfoResponse.ok) {
    throw new Error(`Could not fetch repo info (${repoInfoResponse.status})`);
  }

  const { default_branch: baseBranch } = (await repoInfoResponse.json()) as {
    default_branch: string;
  };

  const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: githubApiHeaders(githubToken),
    body: JSON.stringify({ title, head: branchName, base: baseBranch, body, draft: true }),
  });

  if (!prResponse.ok) {
    const errorBody = await prResponse.text().catch(() => '');
    throw new Error(`Could not open pull request (${prResponse.status}): ${errorBody}`);
  }

  const pr = (await prResponse.json()) as { html_url: string };
  return pr.html_url;
}
