import socket
import distro

ip = socket.gethostbyname(socket.gethostname()).split('.')

initial_uri = "mysql://'departe':password@{}/Proiect_MDS"

if 'Debian' in distro.name():
    ip[-1] = str(2)
    ip = '.'.join(ip)
    with open('/flask/Misc/dbURI', "w") as f:
        f.write(initial_uri.format(ip))
else:
    ip[-1] = str(1)
    ip = '.'.join(ip)
    with open('./dbURI', "w") as f:
        f.write(initial_uri.format(ip))
