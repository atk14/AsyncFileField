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
    ln -s ../../../vendor/atk14/async-file-field/src/public/scripts/utils/async_file_upload.js public/scripts/utils/
    ln -s ../../../vendor/atk14/async-file-field/src/public/styles/shared/_async_file_input.scss public/styles/shared/

Copy migration to a proper filename into your project and perform the migration script:

    cp vendor/atk14/async-file-field/src/db/migrations/0019_temporary_file_uploads.sql db/migrations/
    ./scripts/migrate

Npm packages blueimp-file-upload and jquery-ui-bundle need to be installed. If you don't have them, run:

    npm install --save jquery-ui-bundle blueimp-file-upload

Include required scripts to your gulpfile.

    var vendorScripts = [
          // ...,
          "node_modules/jquery-ui-bundle/jquery-ui.js",
          "node_modules/blueimp-file-upload/js/jquery.fileupload.js"
    ];

    var applicationScripts = [
           // ...,
           "public/scripts/utils/async_file_upload.js",
           "public/scripts/application.js"
    ];

In public/scripts/application.js (public/admin/scripts/application.js, ...), in a spcific action you can initialize the asynchronous file upload this way:

    articles: {
            create_new: function() {
                    UTILS.async_file_upload.init();
            }
    }

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

Configuration
-------------

In config/settings.php, these constants can be defined:

    define("TEMPORARY_FILE_UPLOADS_DIRECTORY",__DIR__ . "/../tmp/temporary_file_uploads/");
    define("TEMPORARY_FILE_UPLOADS_MAX_FILESIZE",512 * 1024 * 1024); // 512MB
    define("TEMPORARY_FILE_UPLOADS_MAX_AGE", 2 * 60 * 60); // 2 hours

License
-------

AsyncFileField is free software distributed [under the terms of the MIT license](http://www.opensource.org/licenses/mit-license)

[//]: # ( vim: set ts=2 et: )
