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


/* تنفيذ الأوامر بعد تحميل الصفحة */
$(document).ready(function () {

    /* تنفيذ الأوامر عند الضغط على زر متابعة */
    $("#continueButton").click(function () {

        /* إظهار نموذج الحجز */
        $("#booking").show();

        /* الانتقال بسلاسة إلى مكان نموذج الحجز */
        $("#booking").get(0).scrollIntoView({
            behavior: "smooth"
        });

    });

});
