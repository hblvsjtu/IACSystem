# -*-coding:utf-8 -*-
import sys
print sys.argv
name = '路径：' + sys.argv[0] + "  参数：" + sys.argv[1]
f = open("./server/result/result.txt", "w+")
f.write(name)