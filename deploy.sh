#!/bin/sh
# Retired as a runtime entrypoint (NLM-101): BodyRes has exactly one development/build
# path (NAS Linux through projectctl) and one production path (static export upload).
# The previous railway/render/fly/local-Docker modes described a second, competing
# runtime architecture that this project no longer supports.
set -u

printf '%s\n' 'deploy.sh no longer runs a local or PaaS deployment.'
printf '%s\n'
printf '%s\n' 'Canonical operations for BodyRes:'
printf '%s\n' '  ssh synology-dev'
printf '%s\n' '  projectctl dev ensure bodyres | dev status bodyres | dev stop bodyres'
printf '%s\n' '  projectctl preview refresh bodyres      # rebuilds the durable NAS preview artifact'
printf '%s\n' '  python scripts/deploy-static-ftp.py     # production: static export to Hostinger (manual, owner-approved)'
printf '%s\n'
printf '%s\n' 'Run projectctl doctor bodyres and projectctl preview status bodyres for verified state.'
exit 2
