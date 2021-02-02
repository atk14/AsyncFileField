AsyncFileField
==============

A set of features providing asynchronous file uploads in ATK14 applications.

Installation
------------

License
-------

    cd path/to/your/project/
    composer require atk14/async-file-field

Copy migration to a proper filename into your project and perform the migration script:

    cp vendor/atk14/async-file-field/src/db/migrations/0019_temporary_file_uploads.sql db/migrations/
    ./scripts/migrate

AsyncFileField is free software distributed [under the terms of the MIT license](http://www.opensource.org/licenses/mit-license)

[//]: # ( vim: set ts=2 et: )
