#!/usr/bin/env sh

set -eu

COMMIT_MESSAGE="${1:-docs: update source content}"
AUTO_REBASE_ON_BEHIND="${MAIN_AUTO_REBASE_ON_BEHIND:-0}"

log() {
  printf '[main] %s\n' "$*"
}

git add .

if git diff --cached --quiet; then
  log "No source changes to upload."
  exit 0
fi

git commit -m "${COMMIT_MESSAGE}"

if git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' >/dev/null 2>&1; then
  # Refresh upstream status before deciding whether to rebase.
  git fetch --quiet
  ahead_behind="$(git rev-list --left-right --count HEAD...@{upstream})"
  ahead_count="$(printf '%s' "$ahead_behind" | awk '{print $1}')"
  behind_count="$(printf '%s' "$ahead_behind" | awk '{print $2}')"

  if [ "${behind_count:-0}" -gt 0 ] && [ "$AUTO_REBASE_ON_BEHIND" != "1" ]; then
    log "Local branch is behind upstream (${behind_count} commits)."
    log "Skip auto rebase by default to avoid unexpected merge conflicts."
    log "Run: git pull --rebase"
    log "Then run: git push"
    log "Or rerun once with MAIN_AUTO_REBASE_ON_BEHIND=1 yarn main"
    exit 2
  fi

  if [ "${behind_count:-0}" -gt 0 ]; then
    log "Branch is behind upstream, running git pull --rebase (MAIN_AUTO_REBASE_ON_BEHIND=1)."
    git pull --rebase
  fi

  log "Upstream status: ahead=${ahead_count:-0}, behind=${behind_count:-0}"
else
  log "No upstream branch configured. Skip pull/rebase."
fi

git push
