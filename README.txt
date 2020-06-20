pass
======
Copyright 2020 Jordan Ocokoljic
Version 0.1.0, 20.6.2020

pass is a small utility I use to generate reasonably secure password for my
own use. It is not perfect, but is good enough for me.

Usage
-------
You can either set pass to be executable (it has a shebang), or call it with
node. To do the latter:

$ node pass.js

To set the permission bits, use chmod:

$ chmod +x pass.js

Then you can call it directly like any other program

$ ./pass.js

Pass accepts 3 possible arguments, these are:

    * -v : Verbose mode, ouputs some extra information.
    * -nonumbers : Indicates that numbers should not appear in the password.
    * -nosymbols : Indicates that symbols should not appear in the password.
