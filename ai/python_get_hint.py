import subprocess,os,sys
import json
import random
import argparse
import ctypes
import time
import os
f=open(os.devnull, "w")
ailib = ctypes.CDLL(os.path.join(os.path.dirname(os.path.abspath(__file__)),'bin/2048.so'))

ailib.init_move_tables()
ailib.init_score_tables()
ailib.find_best_move.argtypes = [ctypes.c_uint64]
ailib.score_toplevel_move.argtypes = [ctypes.c_uint64, ctypes.c_int]
ailib.score_toplevel_move.restype = ctypes.c_float
ailib.get_difficulty.argtypes = [ctypes.ARRAY(ctypes.c_int, 16), ctypes.c_int, ctypes.c_int]
ailib.get_difficulty.restype = ctypes.c_int

ailib.get_hint.argtypes = [ctypes.ARRAY(ctypes.c_int, 16), ctypes.c_int]
ailib.get_hint.restype = ctypes.c_int

ailib.my_move_it.argtypes = [ctypes.ARRAY(ctypes.c_int, 16),ctypes.c_int,ctypes.c_int]
ailib.my_move_it.restype = ctypes.c_void_p

def get_next_board(board,move):
    n = 4
    my_ar = ctypes.c_int * 16
    ar = my_ar()
    for i in range(16):
        ar[i] = board[i]
    ailib.my_move_it(ar,n,move)
    return list(ar)

def get_interesting_board(board):
    n=4
    res={}
    queue=[board]
    checks={json.dumps(board)}
    interested=1
    t1=time.time()
    while len(res)<interested and len(queue)>0 and time.time()-t1<0.3 :
        board=queue.pop()
        print(board)
        n = 4
        my_ar = ctypes.c_int * 16
        ar = my_ar()
        for i in range(16):
            ar[i] = board[i]
        move = ailib.get_hint(ar, n)
        res[json.dumps(board)]=int(move)

        board=get_next_board(board,int(move))
        for i in range(n*n):
                if board[i]==0:
                    for value in [2]:
                        next=list(board)
                        next[i]=value
                        if not json.dumps(next) in checks:
                            checks.add(json.dumps(next))
                            queue.insert(0,next)
    return json.dumps(res)
def test():
    board=[0]*16
    board[1]=2
    board[-5]=4
    temp=get_interesting_board(board)
    print()
#test()
import re
if __name__ == '__main__':
    #print("Python is talking to you")

    parser = argparse.ArgumentParser(description='Some common tasks')
    parser.add_argument('-q', help="list of numbers,16 numbers, separated by , ",)

    args = parser.parse_args()
    q = args.q
    #board=q.split(',')
    board=re.findall('[0-9]+',q)
    board=[int(x) for x in board]
    n = ctypes.c_int
    n = 4
    my_ar = ctypes.c_int * 16
    ar = my_ar()
    for i in range(16):
        ar[i] = board[i]
    res = ctypes.c_int
    g = ctypes.c_int
    g = 8096

    #print "Redirecting stdout"
    sys.stdout.flush() # <--- important when redirecting to files

    # Duplicate stdout (file descriptor 1)
    # to a different file descriptor number
    newstdout = os.dup(1)

    # /dev/null is used just to discard what is being printed
    devnull = os.open('/dev/null', os.O_WRONLY)

    # Duplicate the file descriptor for /dev/null
    # and overwrite the value for stdout (file descriptor 1)
    os.dup2(devnull, 1)

    # Close devnull after duplication (no longer needed)
    os.close(devnull)
    # Use the original stdout to still be able
    # to print to stdout within python
    res=get_interesting_board(board)
    sys.stdout = os.fdopen(newstdout, 'w')
    print(res)
    sys.exit(0)