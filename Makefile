dev-update:
	ssh madaozhang@47.93.97.73 'cd /home/madaozhang/project/dict-api && git co . && git pull && pm2 restart dict-api' && echo 'dict-api updated.'

copy-remote-data:
	mysqldump -h47.93.97.73 -utestuser -ptestuser dict > dict-20180121.sql
	# mysql -h127.0.0.1 -uroot -proot dict < dict.sql
	# rm dict.sql
	echo 'copy finished'
