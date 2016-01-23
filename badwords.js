var bad_words_array=new Array("bitch","fuck","nigger","dick","penis","boob","tits","cunt","vagina","pussy","xxx","cock","cum","rape","orgasm");

function badwords(txt)
{
 var alert_arr=new Array;
 var alert_count=0;
 var compare_text=txt;
 for(var i=0; i<bad_words_array.length; i++)
 {
  for(var j=0; j<(compare_text.length); j++)
  {
   if(bad_words_array[i]==compare_text.substring(j,(j+bad_words_array[i].length)).toLowerCase())
   {
    alert_count++;
   }
  }
 }

 return alert_count;
}