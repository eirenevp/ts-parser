#!/bin/bash

printf "Script for parsing constraints.\n"
printf "File,Constraints\n" > parsedConstraints.csv

for f in $(find /Users/iren/Code/opttyper/Evaluation/modules -name '*constraints.json'); 
do 
    python "src/parser-constraints.py" --in_file=${f} --out_file="/Users/iren/Code/ts-parser/parsedConstraints.csv"
done
