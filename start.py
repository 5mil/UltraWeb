#!/usr/bin/env python


# Included modules
import sys

# utraweb Modules
import utraweb


def main():
    sys.argv += ["--open_browser", "default_browser"]
    utraweb.main()

if __name__ == '__main__':
    main()
