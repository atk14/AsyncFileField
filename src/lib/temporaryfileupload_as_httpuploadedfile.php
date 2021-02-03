<?php
class TemporaryFileUpload_as_HTTPUploadedFile extends HTTPUploadedFile{

	function __construct($temporary_file_upload){
		// TODO: This may lead to troubles in the future because the private stuff of HTTPUploadedFile is manipulated
		$this->_TmpFileName = $temporary_file_upload->getFullPath();
		$this->_Name = $temporary_file_upload->getFormName();
		$this->_FileName = $temporary_file_upload->getFilename();
		$this->_MimeType = $temporary_file_upload->getMimeType();
	}
}
