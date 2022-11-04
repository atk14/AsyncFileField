<?php
class AsyncFileInput extends FileInput {

	function render($name, $value, $options=array()){
		$input = parent::render($name, $value, $options); // <input type="file' ...>

		$template_loading = '
			<div class="progress">
				<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
				</div>
			</div>
		';

		$trash_icon = '<span class="far fa-trash-alt"></span>';
		if(!defined("USING_FONTAWESOME") || !constant("USING_FONTAWESOME")){
			$trash_icon = '<span>&times;</span>';
		}

		$template_done = '
			<div class="async-file-input__result done"><span class="fileicon fileicon-%fileext% fileicon-color"></span> <span class="file-text">%filename% <span class="text-muted">%filesize_localized%</span></span> <button type="button" class="btn btn-danger btn-sm js--remove" data-destroy_url="%destroy_url%" title="'.h(_("Remove file")).'">'.$trash_icon.'</button>
			<input type="hidden" name="%name%" value="%token%"></div>
		';

		$template_error = '<div class="async-file-input__result error"><i class="fas fa-exclamation-circle"></i><span class="file-text">%error_message%</span> <button type="button" class="btn btn-light btn-sm js--confirm">OK</button></div>';

		$default = $input;

		if(
			(is_a($value,"TemporaryFileUpload") && ($file = $value)) ||
			(is_string($value) && ($file = TemporaryFileUpload::GetInstanceByToken($value)))
		){
			Atk14Require::Helper("modifier.format_bytes");
			$default = strtr($template_done,array(
				"%filename%" => h($file->getFilename()),
				"%fileext%" => h($file->getSuffix()),
				"%filesize_localized%" => smarty_modifier_format_bytes($file->getFilesize()),
				"%name%" => h($name),
				"%token%" => $file->getToken(),
				"%destroy_url%" => h(Atk14Url::BuildLink([
					"namespace" => "api",
					"controller" => "temporary_file_uploads",
					"action" => "destroy",
					"token" => $file->getToken(),
					"format" => "json",
				],[
					"with_hostname" => true,
				])),
			));
		}

		$out = '
			<div class="js--async-file" data-name="'.h($name).'" data-input="'.h($input).'" data-template_loading="'.h($template_loading).'" data-template_done="'.h($template_done).'" data-template_error="'.h($template_error).'">
				'.$default.'
			</div>
		';

		return $out;
	}

	function value_from_datadict($data, $name){
		if(isset($data[$name]) && is_string($data[$name]) && strlen($data[$name])){
			$token = $data[$name];
			$temporary_file_upload = TemporaryFileUpload::GetInstanceByToken($token);
			if($temporary_file_upload){
				$temporary_file_upload->setFormName($name);
				return $temporary_file_upload;
			}
			return $token;
		}
		return parent::value_from_datadict($data, $name);
	}
}
