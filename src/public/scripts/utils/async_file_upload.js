// This file is part of package atk14/async-file-field
// See https://packagist.org/packages/atk14/async-file-field or https://github.com/atk14/AsyncFileField

window.UTILS = window.UTILS || { };

window.UTILS.async_file_upload = { };
window.UTILS.async_file_upload.init = function() {
	var $ = window.jQuery;

	var fileuploadOptions,
		removeButtonHandler,
		confirmButtonHandler,
		escapeHtml = function( unsafe ) {
			return unsafe
				.replace( /&/g, "&amp;" )
				.replace( /</g, "&lt;" )
				.replace( />/g, "&gt;" )
				.replace( /"/g, "&quot;" )
				.replace( /'/g, "&#039;" );
		};
	var lang = $( "html" ).attr( "lang" );

	fileuploadOptions = {
		dataType: "json",
		url: "/api/" + lang + "/temporary_file_uploads/create_new/?format=json",
		maxChunkSize: 1024 * 1024,
		multipart: false,
		sequentialUploads: true,
		dropZone: null,
		start: function() {
			this.$wrap = $( this ).parents( ".js--async-file" );
			this.$wrap.html( this.$wrap.data( "template_loading" ) );
			this.$progress = this.$wrap.find( ".progress-bar" );
		},
		progressall: function( e, data ) {
			var progress = parseInt( data.loaded / data.total * 100, 10 );

			this.$progress.css(
				"width",
				progress + "%"
			);
		},
		done: function( e, data ) {
			var $wrap = this.$wrap;
			console.log( data );
			var template = $wrap.data( "template_done" );
			template = template
				.replace( "%filename%", escapeHtml( data.result.filename ) )
				.replace( "%fileext%", escapeHtml(
					data.result.filename.split( "." ).pop().toLowerCase()
				) )
				.replace( "%filesize_localized%", escapeHtml( data.result.filesize_localized ) )
				.replace( "%token%", escapeHtml( data.result.token ) )
				.replace( "%name%", escapeHtml( $wrap.data( "name" ) ) )
				.replace( "%destroy_url%", escapeHtml( data.result.destroy_url ) );

			$wrap.html( template );

			$wrap.find( ".js--remove" ).on( "click",  removeButtonHandler );
		},
		fail: function( e, data ) {
			var $wrap = this.$wrap;
			var jqXHR = data._response && data._response.jqXHR;
			var errMsg = "Error occurred";
			if( jqXHR && jqXHR.responseJSON && jqXHR.responseJSON[ 0 ] ) {
				errMsg = jqXHR.responseJSON[ 0 ];
			}
			if( jqXHR ) {
				// Append HTTP status so the cause can be diagnosed from a screenshot alone
				// (e.g. 0 = network/CORS failure, 413 = rejected by a proxy, 500 = server crash)
				errMsg += " (HTTP " + jqXHR.status + ( jqXHR.statusText ? " " + jqXHR.statusText : "" ) + ")";
				if( jqXHR.status === 0 ) {
					// Connection was lost / never reached the server - retrying may well succeed
					errMsg += " Please try it again later.";
				}
			}
			var template = $wrap.data( "template_error" );
			template = template
				.replace( "%error_message%", escapeHtml( errMsg ) );

			$wrap.html( template );
			$wrap.find( ".js--confirm" ).on( "click",  confirmButtonHandler );
		}
	};

	removeButtonHandler = function() {
		var $button = $( this );
		var $wrap = $button.parents( ".js--async-file" );
		$.ajax( {
			url: $button.data( "destroy_url" ),
			method: "POST"
		} );
		$wrap.html( $wrap.data( "input" ) );
		$wrap.find( "input[type=file]" ).fileupload( fileuploadOptions );
	};

	confirmButtonHandler = function() {
		var $button = $( this );
		var $wrap = $button.parents( ".js--async-file" );
		$wrap.html( $wrap.data( "input" ) );
		$wrap.find( "input[type=file]" ).fileupload( fileuploadOptions );
	};

	$( ".js--async-file input[type=file]" ).fileupload( fileuploadOptions );
	$( ".js--async-file .js--remove" ).on( "click", removeButtonHandler );
};
