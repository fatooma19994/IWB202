$(document).ready(function () {
    $("input[name='details']").change(function () {
        var carCode = $(this).val();
        var detailsRow = $("#details-" + carCode);

        if ($(this).is(":checked")) {
            detailsRow.show();
        } else {
            detailsRow.hide();
        }
    });
});