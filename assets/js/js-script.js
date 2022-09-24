// JavaScript Document


//  for select / deselect all

$('document').ready(function()
{
    $(".select-all").click(function ()
    {
        $('.chk-box').attr('checked', this.checked)
    });
        
    $(".chk-box").click(function()
    {
        if($(".chk-box").length == $(".chk-box:checked").length)
        {
            $(".select-all").attr("checked", "checked");
        }
        else
        {
            $(".select-all").removeAttr("checked");
        }
    });
});

//  page redirect on user click delete
function delete_message() 
{
	document.frm.action = "message_delete.php";
	document.frm.submit();
}
//  page redirection