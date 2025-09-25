# MeshSpire-Core

🚀 Collaboration Workflow (GitHub)

This document explains how team members should clone, contribute, and merge code safely.

1. Clone the repository

Each teammate clones the repo once:

git clone git@github.com:ORG_NAME/MeshSpire-Core.git
cd MeshSpire-Core

2. Checkout your assigned branch

Branches have been created for each teammate (kom, kul, rajat, alice, bob).
Switch to your branch:

git checkout YOUR_BRANCH_NAME
git pull origin YOUR_BRANCH_NAME

Example:

git checkout kom
git pull origin kom

3. Work on your branch

Write your code.

Stage changes:

git add .

Commit with a clear message:

git commit -m "feat(auth): add signup API"

Push your branch:

git push origin YOUR_BRANCH_NAME

4. Open a Pull Request (PR) → dev

Go to the repository on GitHub.

Click Pull Requests → New pull request.

Set:

Base branch: dev

Compare branch: YOUR_BRANCH_NAME

Add a short title + description of your changes.

Assign reviewers (another teammate).

5. Code Review & Merge into dev

Teammates review your PR.

Once approved:

Click Merge pull request (Squash & Merge recommended).

Delete your feature branch from GitHub (optional).

Now your changes are in the shared dev branch.

6. Test dev

The dev branch is the integration environment.

After all teammates merge their work, test everything end-to-end.

7. Promote dev → main (Production)

When dev is stable:

Open a PR on GitHub:

Base branch: main

Compare branch: dev

Review & approve.

Merge the PR → this updates production (main).

🔑 Rules

Never push directly to main or dev. Always use PRs.

Each teammate works only in their own branch.

Keep commits small and meaningful.

Always pull latest changes before starting work:

git checkout YOUR_BRANCH_NAME
git pull origin dev
