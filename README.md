AsyncFileField
==============

A set of features providing asynchronous file uploads in ATK14 applications.

AsyncFileField is a great replace for built-in FileField.

Installation
------------

    cd path/to/your/project/
    composer require atk14/async-file-field

    ln -s ../../../vendor/atk14/async-file-field/src/app/controllers/api/temporary_file_uploads_controller.php app/controllers/api/
    ln -s ../../../vendor/atk14/async-file-field/src/app/forms/api/temporary_file_uploads app/forms/api/
    ln -s ../../vendor/atk14/async-file-field/src/app/models/temporary_file_upload.php app/models/
    ln -s ../../vendor/atk14/async-file-field/src/app/fields/async_file_field.php app/fields/
    ln -s ../../vendor/atk14/async-file-field/src/app/widgets/async_file_input.php app/widgets/
    ln -s ../../../vendor/atk14/async-file-field/src/public/scripts/utils/async_file_upload.v2.js public/scripts/utils/async_file_upload.js
    ln -s ../../../vendor/atk14/async-file-field/src/public/styles/shared/_async_file_input.v2.scss public/styles/shared/_async_file_input.scss

Copy migration to a proper filename into your project and perform the migration script:

    cp vendor/atk14/async-file-field/src/db/migrations/0019_temporary_file_uploads.sql db/migrations/
    ./scripts/migrate

Include async_file_upload.js to your gulpfile.

    var applicationScripts = [
           // ...,
           "public/scripts/utils/async_file_upload.js",
           "public/scripts/application.js"
    ];

In public/scripts/application.js (or public/admin/scripts/application.js, ...), globally or for a specific action you can initialize the asynchronous file upload this way:

    // globally
    common: {
      init: function() {
        // ...
        UTILS.async_file_upload.init();
      }
    }

    // specific action
    articles: {
      create_new: function() {
        UTILS.async_file_upload.init();
      }
    }

Include styles for AsyncFileField in public/styles/application.scss (or public/admin/styles/application.scss, ...):

    @import "shared/async_file_input";

Finally, in a form you can replace FileField with AsyncFileField.

    <?php
    class CreateNewForm extends ApplicationForm {
        function set_up(){
            $this->add_field("image", new AsyncFileField([
              "label" => "Image",
              "allowed_mime_types" => ["image/jpg","image/png"],
            ]));
        }
    }

Chunked file upload
-------------------

Files are being uploaded to the server chunked into 1MB chunks. The maximum total size of a uploaded file can be defined in constant TEMPORARY_FILE_UPLOADS_MAX_FILESIZE. By default it is 512MB.

Stale files removal
-------------------

Stale files are being deleted automatically after the period specified in constant TEMPORARY_FILE_UPLOADS_MAX_AGE. By default, the period is 2 hours.

Configuration
-------------

In config/settings.php, these constants can be defined:

    define("TEMPORARY_FILE_UPLOADS_ENABLED",true); // Temporary file uploading can be disabled here
    define("TEMPORARY_FILE_UPLOADS_DIRECTORY",__DIR__ . "/../tmp/temporary_file_uploads/");
    define("TEMPORARY_FILE_UPLOADS_MAX_FILESIZE",512 * 1024 * 1024); // 512MB
    define("TEMPORARY_FILE_UPLOADS_MAX_AGE", 2 * 60 * 60); // 2 hours

Legacy usage
------------

If you are using Bootstrap 3, you can find a less file in the package. Symlink it into your project.

    ln -s ../../../vendor/atk14/async-file-field/src/public/styles/shared/async_file_input.less public/styles/shared/

And use the file in your application.less.

    @import url( "./shared/async_file_input.less" );

If you symlink async_file_upload.js and not async_file_upload.v2.js, npm packages blueimp-file-upload and jquery-ui-bundle are required.

These packages need to be installed using npm.

    npm install --save jquery-ui-bundle blueimp-file-upload

Then add the files to your gulp file.

    var vendorScripts = [
         // ...,
         "node_modules/jquery-ui-bundle/jquery-ui.js",
         "node_modules/blueimp-file-upload/js/jquery.fileupload.js"
    ];

License
-------

AsyncFileField is free software distributed [under the terms of the MIT license](http://www.opensource.org/licenses/mit-license)

[//]: # ( vim: set ts=2 et: )
