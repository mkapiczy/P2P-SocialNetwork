#!/bin/bash\

counter=8000

while [ $counter -le 8010 ]
do
    ttab node dist/index $counter
	((counter++))
done
