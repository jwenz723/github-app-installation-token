# GitHub App Installation Token

This [JavaScript GitHub Action](https://help.github.com/en/actions/building-actions/about-actions#javascript-actions) can be used to impersonate a GitHub App Installation when `secrets.GITHUB_TOKEN`'s limitations are too restrictive and a personal access token is not suitable.
This action is built with inspiration from [tibdex/github-app-installation](https://github.com/tibdex/github-app-token) but with a slightly different
authentication pattern. This action authenticates directly to an app installation, rather than impersonating a repository.

[`secrets.GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) has limitations such as [not being able to triggering a new workflow from another workflow](https://github.community/t5/GitHub-Actions/Triggering-a-new-workflow-from-another-workflow/td-p/31676).
A workaround is to use a [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) from a [personal user/bot account](https://help.github.com/en/github/getting-started-with-github/types-of-github-accounts#personal-user-accounts).
However, for organizations, GitHub Apps are [a more appropriate automation solution](https://developer.github.com/apps/differences-between-apps/#machine-vs-bot-accounts).

# Example Workflow

```yml
jobs:
  job:
    runs-on: ubuntu
    steps:
      - name: Generate installation token
        id: generate_installation_token
        # You should use a released version number here rather than `main`
        uses: jwenz723/github-app-installation-token@main
        with:
          app_id: ${{ secrets.APP_ID }}
          client_id: ${{ secrets.CLIENT_ID }}
          client_secret: ${{ secrets.CLIENT_SECRET }}
          installation_id: ${{ secrets.INSTALLATION_ID }}
          private_key: ${{ secrets.PRIVATE_KEY }}
      - name: Use token
        env:
          TOKEN: ${{ steps.generate_installation_token.outputs.token }}
        run: |
          echo "The generated token is masked: ${TOKEN}"
```
