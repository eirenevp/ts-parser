import os
import sys
import glob
import argparse
import json
from pathlib import Path


class Expr:
    def __init__(self, op):
        super().__init__()
        self.op = op
        self.e1 = None
        self.e2 = None

    def addExpr(self, op, e1, e2):
        self.op = op
        self.e1 = e1
        self.e2 = e2


def walk_dict(d, num2var, num2typ, out_file):
    if (d['id'] == "IS"):
        print("(" +
              num2var[d['X']] + "=" + num2typ[d['T']] + ")", end="", file=out_file)
    elif (d['id'] == "AND"):
        print("AND (", end="", file=out_file)
        for c in d['children']:
            walk_dict(c, num2var, num2typ, out_file)
        print(")", end=" ", file=out_file)
    elif (d['id'] == "OR"):
        print("OR (", end="", file=out_file)
        for c in d['children']:
            walk_dict(c, num2var, num2typ, out_file)
        print(")", end=" ", file=out_file)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--in_file', type=str,
                        help='Path for input file with constraints.json')
    parser.add_argument('--out_file', type=str,
                        help='Path for output file with serialised constraints.')

    args = parser.parse_args()
    with open(args.in_file) as constraints_file:
        c = json.load(constraints_file)

        var2num = c['var2num']
        num2var = {v: k for k, v in var2num.items()}

        typ2num = c['typ2num']
        num2typ = {v: k for k, v in typ2num.items()}

        constraints = c['constraints'][0]
        with open(args.out_file, 'a+') as out_file:
            src_file = args.in_file.replace('constraints.json', 'ts')
            print('"' + src_file + '"', end=',"', file=out_file)
            walk_dict(constraints, num2var, num2typ, out_file)
            print(end='"\n', file=out_file)
        # out_file.close()


if __name__ == '__main__':
    main()
