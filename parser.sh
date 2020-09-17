#!/bin/bash

DIST_PATH=./dist

printf "Script for parsing files.\n"
# rm parsedFunctions.csv
printf "File,FnId,Type\n" > parsedFunctions.csv

for f in $(find ../test-repos/* -name '*.ts'); 
do 
    # printf "${f#../test-repos/}," >> parsedFunctions.csv 
    node ${DIST_PATH}/parser.js ${f} parsedFunctions.csv
done
