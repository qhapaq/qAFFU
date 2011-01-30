/*
* qAFFU - Ajax Flash File Upload
* Copyright (c) Moises Torres 
* Licensed under the MIT license
* http://devtorres.net/qaffu
*/

/*
* objeto QAFFU
* @param {options},  opciones de configuracion
*/

var QAFFU = function(options){
	
	/* establecemos datos por defecto si es que no viene en options */
	var o = $.extend({
		/* tag para ubicar a qAFFU */
		tag: ".qaffu",
		/* ruta y nombre del motor qAFFU.swf */
		swf: "qAFFU.swf",
		/* dimensiones del swf (depende del label) */
		size: {"width":"115","height":"18"},
		/* filtrado de archivos a seleccionar */
		filter: '{"Images":"*.jpg;*.gif;*.png","Documents":"*.pdf;*.doc;*.txt"}',
		/* determina si es posible o no de seleccionar multiples archivos */
		multiselect: true,
		/* texto del enlace a mostrar */
		label: '{"text":"Adjuntar un archivo","css":".label {font-family: Arial, Helvetica, _sans; text-decoration:underline; font-size: 13; color:#2200CC}"}',
		/* script encargado de recibir los archivos */
		server_script: "qAFFU.server.php",
		/* prefijo del nombre del archivo temporal */
		server_prefix_tmp_file: ""
	}, options );

	var swfPush = ($.browser.msie) ? ('<object id="id" name="id" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+o.size.width+'" height="'+o.size.height+'"><param name="AllowScriptAccess" value="always" /><param name="wmode" value="transparent" /><param name="movie" value="swf" /><param name="quality" value="high" /></object>' ) : ('<embed id="id" src="swf" quality="high" type="application/x-shockwave-flash" width="'+o.size.width+'" height="'+o.size.height+'" wmode="transparent" AllowScriptAccess="always"></embed>');
	var log = function(pa){ try{ console.log(pa); }catch(e){ alert(pa);} }
	var btnSubmit = null;
	var wait = 0;
	this.log = log;
	
	/* renderiza motor qAFFU */
	$(o.tag).each(function() {
		var t = $(this);
		var i = parseInt(Math.random() * 10000);
		var p = encodeURIComponent('{"id":"' + i + '","filter":' + o.filter + ',"multiselect":' + o.multiselect.toString() +',"label":' + o.label + ',"server_script":"'+o.server_script+'","server_prefix_tmp_file":"'+o.server_prefix_tmp_file+'"}');
		t.attr("id","qaffuid__"+i);
		if (btnSubmit==null) btnSubmit = t.parent("form").find("button[type=submit]");
		swfPush = swfPush.replace(/\"id\"/gi,"\"swfid__"+i+"\"");
		swfPush = swfPush.replace("\"swf\"","\""+o.swf+"?rnd="+i+"&data="+p+"\"");
		var d = $("<div class=\"qaffu-swf\" id=\"cswfid__"+i+"\"></div>");
		
		t.prepend(d);
		if ($.browser.msie){
			d.get(0).outerHTML = swfPush;
		}else{
			d.prepend(swfPush);
		}
	});
	
	/* sucede al crear el upload del archivo */
	this.createEvent = function(data){
		wait++;
		if (wait > 0) btnSubmit.attr("disabled","disabled");
		data = eval(data)[0];
		var i = data.id.split("_");
		var d = $("#qitm__"+i[0]);
		if (d.length==0){
			d = $('<div class="qaffu-list" id="qitm__'+i[0]+'">');
			$("#qaffuid__"+i[0]).prepend(d);
		}
		var h = '<div class="qaffu-item"><input class="qaffu-chk" name="qfiles[]" value="' + data.remote + ' ' + escape(data.name) + '" type="checkbox"  id="qchk__id" style="display:none" /><span class="qaffu-caption">__cpt</span><div class="qaffu-progress-bg"><div class="qaffu-progress" id="qbxc__id"></div></div><a class="qaffu-cancel" href="#Cancenlar" id="qcnc__id">Cancelar</a></div>';
		h = h.replace(/__id/gi,"__"+data.id).replace(/__cpt/gi,(data.name+" "+(Math.round(data.size/1024))+" K"));
		d.append(h);
		$("#qcnc__"+data.id).click(function(){
			$("#swfid__"+i[0]).get(0).qCancelEvent(i[1]);
			$(this).parent().remove();
		});
	}
	/* sucede cuando existe un error al subir archivo  */
	this.errorEvent = function(data){
		data = eval(data)[0];
		$("#qchk__"+data.id).parent().empty().prepend("<div class='qaffu-error'>"+data.name+" &mdash; "+data.error+"</div>");
	}
	/* progreso de subida del archivo */
	this.progressEvent = function(data){
		data = eval(data)[0];
		$("#qbxc__"+data.id).css("width",data.progress+"px");
	}
	/* sucede al completar la subida de un archivo */
	this.completeEvent = function(data){
		wait--;
		data = eval(data)[0];
		$("#qbxc__"+data.id).parent().remove();
		$("#qcnc__"+data.id).remove();
		$("#qchk__"+data.id).css("display","block").attr("checked","checked");
		if (wait <= 1) btnSubmit.attr("disabled","");
	}
}
