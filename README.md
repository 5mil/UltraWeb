# utraweb [![Build Status](https://travis-ci.org/Helloutraweb/utraweb.svg?branch=master)](https://travis-ci.org/Helloutraweb/utraweb) [![Documentation](https://img.shields.io/badge/docs-faq-brightgreen.svg)](https://utraweb.readthedocs.org/en/latest/faq/) [![Help](https://img.shields.io/badge/keep_this_project_alive-donate-yellow.svg)](https://utraweb.readthedocs.org/en/latest/help_utraweb/donate/)

Decentralized websites using Bitcoin crypto and the BitTorrent network - http://utraweb.io


## Why?

* We believe in open, free, and uncensored network and communication.
* No single point of failure: Site remains online so long as at least 1 peer
  serving it.
* No hosting costs: Sites are served by visitors.
* Impossible to shut down: It's nowhere because it's everywhere.
* Fast and works offline: You can access the site even if your internet is
  unavailable.


## Features
 * Real-time updated sites
 * Namecoin .bit domains support
 * Easy to setup: unpack & run
 * Clone websites in one click
 * Password-less [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
   based authorization: Your account is protected by same cryptography as your Bitcoin wallet
 * Built-in SQL server with P2P data synchronization: Allows easier site development and faster page load times
 * Tor network support
 * TLS encrypted connections
 * Automatic, uPnP port opening
 * Plugin for multiuser (openproxy) support
 * Works with any browser/OS


## How does it work?

* After starting `utraweb.py` you will be able to visit utraweb sites using
  `http://127.0.0.1:43110/{utraweb_address}` (eg.
  `http://127.0.0.1:43110/1EU1tbG9oC1A8jz2ouVwGZyQ5asrNsE4Vr`).
* When you visit a new utraweb site, it tries to find peers using the BitTorrent
  network so it can download the site files (html, css, js...) from them.
* Each visited site becomes also served by you.
* Every site contains a `content.json` which holds all other files in a sha512 hash
  and a signature generated using site's private key.
* If the site owner (who has the private key for the site address) modifies the
  site, then he/she signs the new `content.json` and publishes it to the peers.
  After the peers have verified the `content.json` integrity (using the
  signature), they download the modified files and publish the new content to
  other peers.

####  [Slideshow about utraweb cryptography, site updates, multi-user sites »](https://docs.google.com/presentation/d/1_2qK1IuOKJ51pgBvllZ9Yu7Au2l551t3XBgyTSvilew/pub?start=false&loop=false&delayms=3000)
####  [Frequently asked questions »](http://utraweb.readthedocs.org/en/latest/faq/)



## Screenshots

![Screenshot](http://utraweb.readthedocs.org/en/latest/img/zerohello.png)
![ZeroTalk](http://utraweb.readthedocs.org/en/latest/img/zerotalk.png)

#### [More screenshots in utraweb docs »](http://utraweb.readthedocs.org/en/latest/using_utraweb/sample_sites/)


## How to join?

### Windows

* [Download ZeroBundle package](https://github.com/Helloutraweb/ZeroBundle/releases/download/0.1.1/ZeroBundle-v0.1.1.zip) that includes Python 2.7.9 and all required libraries
* Unpack to any directory
* Run `utraweb.cmd`

It downloads the latest version of utraweb then starts it automatically.


#### Alternative method for Windows by installing Python

* [Install Python 2.7](https://www.python.org/ftp/python/2.7.9/python-2.7.9.msi)
* [Install Python Greenlet](http://utraweb.io/files/windows/greenlet-0.4.5.win32-py2.7.exe)
* [Install Python Gevent](http://utraweb.io/files/windows/gevent-1.0.1.win32-py2.7.exe)
* [Install Python MsgPack](http://utraweb.io/files/windows/msgpack-python-0.4.2.win32-py2.7.exe)
* [Download and extract utraweb](https://codeload.github.com/Helloutraweb/utraweb/zip/master) to any directory
* Run `start.py`

### Linux

#### Debian

* `sudo apt-get update`
* `sudo apt-get install msgpack-python python-gevent`
* `wget https://github.com/5mil/utraweb/archive/master.tar.gz`
* `tar xvpfz master.tar.gz`
* `cd utraweb-master`
* Start with `python utraweb.py`
* Open http://127.0.0.1:43110/ in your browser and enjoy! :)

#### Other Linux or without root access
* Check your python version using `python --version` if the returned version is not `Python 2.7.X` then try `python2` or `python2.7` command and use it from now
* `wget https://bootstrap.pypa.io/get-pip.py`
* `python get-pip.py --user gevent msgpack-python`
* Start with `python utraweb.py`

### Mac

 * Install [Homebrew](http://brew.sh/)
 * `brew install python`
 * `pip install gevent msgpack-python`
 * [Download](https://github.com/Helloutraweb/utraweb/archive/master.zip), Unpack, run `python utraweb.py`

### Vagrant

* `vagrant up`
* Access VM with `vagrant ssh`
* `cd /vagrant`
* Run `python utraweb.py --ui_ip 0.0.0.0`
* Open http://127.0.0.1:43110/ in your browser

### Docker
* `docker run -p 15441:15441 -p 43110:43110 nofish/utraweb`
* Open http://127.0.0.1:43110/ in your browser

## Current limitations

* No torrent-like, file splitting for big file support
* No more anonymous than Bittorrent
* File transactions are not compressed ~~or encrypted yet~~
* No private sites
* ~~You must have an open port to publish new changes~~
* ~~Timeout problems on slow connections~~


## How can I create a utraweb site?

Shut down utraweb if you are running it already

```bash
$ utraweb.py siteCreate
...
- Site private key: 23DKQpzxhbVBrAtvLEc2uvk7DZweh4qL3fn3jpM3LgHDczMK2TtYUq
- Site address: 13DNDkMUExRf9Xa9ogwPKqp7zyHFEqbhC2
...
- Site created!
$ utraweb.py
...
```

Congratulations, you're finished! Now anyone can access your site using
`http://localhost:43110/13DNDkMUExRf9Xa9ogwPKqp7zyHFEqbhC2`

Next steps: [utraweb Developer Documentation](http://utraweb.readthedocs.org/en/latest/site_development/getting_started/)


## How can I modify a utraweb site?

* Modify files located in data/13DNDkMUExRf9Xa9ogwPKqp7zyHFEqbhC2 directory.
  After you're finished:

```bash
$ utraweb.py siteSign 13DNDkMUExRf9Xa9ogwPKqp7zyHFEqbhC2
- Signing site: 13DNDkMUExRf9Xa9ogwPKqp7zyHFEqbhC2...
Private key (input hidden):
```

* Enter the private key you got when you created the site, then:

```bash
$ utraweb.py sitePublish 13DNDkMUExRf9Xa9ogwPKqp7zyHFEqbhC2
...
Site:13DNDk..bhC2 Publishing to 3/10 peers...
Site:13DNDk..bhC2 Successfuly published to 3 peers
- Serving files....
```

* That's it! You've successfully signed and published your modifications.


## If you want to help keep this project alive

- Bitcoin: 1QDhxQ6PraUZa21ET5fYUCPgdrwBomnFgX
- Paypal: https://utraweb.readthedocs.org/en/latest/help_utraweb/donate/

### Sponsors

* Better OSX/Safari compatibility made possible by [BrowserStack.com](https://www.browserstack.com)

#### Thank you!

* More info, help, changelog, utraweb sites: http://www.reddit.com/r/utraweb/
* Come, chat with us: [#utraweb @ FreeNode](https://kiwiirc.com/client/irc.freenode.net/utraweb) or on [gitter](https://gitter.im/Helloutraweb/utraweb)
* Email: hello@noloop.me
