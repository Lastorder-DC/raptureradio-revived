function wallTV1() 
{
// document.getElementById('wall_tv1').innerHTML = '<embed src="swf/tv_1.swf" width="98" height="71" loop="false" menu=false wmode=transparent quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" align="top"></embed>';
}
function wallTV2() 
{
// document.getElementById('wall_tv2').innerHTML = '<embed src="swf/tv_2.swf" width="98" height="71" loop="false" menu=false wmode=transparent quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" align="top"></embed>';
}
	
function addOnloadEvent(funct)
{
  if ( typeof window.addEventListener != "undefined" )
    window.addEventListener( "load", funct, false );
  else if ( typeof window.attachEvent != "undefined" ) 
  {
    window.attachEvent( "onload", funct );
  }
  else 
  {
    if ( window.onload != null ) 
    {
      var oldOnload = window.onload;
      window.onload = function ( e ) 
      {
        oldOnload( e );
        window[funct]();
      };
    }
    else 
      window.onload = funct;
  }
}
	
function MaxLength(field, maxLength)
{

    	if (field.value.length >= maxLength)
        field.value = field.value.substring(0, maxLength - 1);
}

function newRadio(url) 
{
	radioLoad = window.open(url,'radioLoad','height=523,width=614,left=0,top=0,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no')
}

function newGuide(url) 
{
	radioLoad = window.open(url,'guideLoad','height=523,width=614,left=0,top=0,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no')
}

function newReport(url) 
{
	radioLoad = window.open(url,'reportLoad','height=637,width=850,left=0,top=0,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no')
}
