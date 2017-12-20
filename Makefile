dev-update:
	ssh madaozhang@47.93.97.73 'cd /home/madaozhang/project/dict-api && git co . && git pull && pm2 restart dict-api' && echo 'dict-api updated.'
