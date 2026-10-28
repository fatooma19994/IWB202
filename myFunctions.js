/* جميع أحداث الصفحة والتحقق والحساب في ملف واحد. */
$(document).ready(function () {
  $("#continueButton, #booking, #bookingResult").hide();
  $('input[name="details"]').change(function () {
    $("#details-" + this.value).toggle(this.checked);
  });
  $('input[name="selectedCars"]').change(function () {
    const selectedCount = $('input[name="selectedCars"]:checked').length;

    /** نتحقق من وجود check على الزر  */
    if (selectedCount > 0) {
      /** نظهر الزر */
      $("#continueButton").show();
    } else {
      /** نحفي الزر */
      $("#continueButton").hide();
    }
  });
  /* تنفيذ الأوامر عند الضغط على زر متابعة */
  $("#continueButton").click(function () {
    /* إظهار نموذج الحجز */
    $("#booking").show();

    /* الانتقال بسلاسة إلى مكان نموذج الحجز */
    $("#booking").get(0).scrollIntoView({
      behavior: "smooth",
    });
  });
  /**عند الضغط على زر التفاصيل يعرض تفاصيل السيارة  */
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
function validateField(id, valid, message) {
  document.getElementById("error_" + id).textContent = valid ? "" : message;
  document.getElementById(id).classList.toggle("invalid", !valid);
  return valid;
}
function checkFullName() {
  /**
   regixe
   * [\u0621-\u064A\s] يقبل المحارف العربية جميعها مع محارف whitespace \s
   * + يجب أن يكتب محرف واحد على الاقل
   *
   */
  var value = document.getElementById("full_name").value;

  var pos = /^[\u0621-\u064A\s]+$/.test(value);

  return validateField(
    "full_name",
    value === "" || pos,
    "الاسم يجب أن يحتوي على أحرف عربية فقط مع مسافات بين الكلمات.",
  );
}
function checkNationalIdNumber() {
  /**
   regixe
   * ^(0[1-9]|1[0-4])   يجب ان يبدأ ب 0 وأي رقم بعده أو 1 وأي رقم بعد لكن لحد رقم 4 
   * \d{9} وبعدها 9 ارقام وبالتالي المجموع يساوي 11
   *
   */

  var pos = /^(0[1-9]|1[0-4])\d{9}$/.test(
    document.getElementById("national_id_number").value,
  );
  return validateField(
    "national_id_number",
    pos,
    "أدخل 11 رقماً تماماً، أول خانتين من 01 إلى 14.",
  );
}

function checkEndDate() {
  var start = document.getElementById("start_date").value;
  var end = document.getElementById("end_date").value;
  var validStart = validateField(
    "start_date",
    start !== null,
    "أدخل تاريخ بداية صحيحاً.",
  );
  var validEnd = validateField(
    "end_date",
    end !== null && start !== null && end > start,
    "أدخل تاريخ نهاية صحيحاً ولاحقاً للبداية.",
  );
  return validStart && validEnd;
}
function checkMobile() {
  var value = document.getElementById("mobile").value;

  /**
   regixe
   * 09  يجب ان يبدأ ب 09 حصرا
   * (3|4|5|6|8|9) يجب أن يجتوي على 3 أو 4 أو 5 أو 6 أو 8 أو 9
   * لان ارقام سيرياتيل 3 أو 8 أو 9
   * و MTN 4 , 5 , 6
   * \d{7} وبعدها 7 ارقام وبالتالي المجموع يساوي 10
   *
   */
  var pos = /^09(3|4|5|6|8|9)\d{7}$/.test(value);

  return validateField(
    "mobile",
    value === "" || pos,
    "أدخل رقم موبايل Syriatel أو MTN من 10 أرقام، مثل 0931234567.",
  );
}
function checkEmail() {
  var value = document.getElementById("email").value;
  return validateField(
    "email",
    value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "أدخل بريداً إلكترونياً صحيحاً مثل name@example.com.",
  );
}
function calculateRental(prices, days) {
  var subtotal = 0;
  for (var i = 0; i < prices.length; i++) subtotal += prices[i] * days;
  var discount = days > 7 ? subtotal * 0.1 : 0;
  return { subtotal: subtotal, discount: discount, total: subtotal - discount };
}

function submitForm(event) {
  event.preventDefault();

  var checks = [
    checkFullName(),
    checkNationalIdNumber(),
    checkEndDate(),
    checkMobile(),
    checkEmail(),
  ];

  if (checks.includes(false)) {
    var invalidField = document.querySelector("#booking .invalid");

    if (invalidField) {
      invalidField.focus();
    }

    return false;
  }

  var selected = document.querySelectorAll(
    'input[name="selectedCars"]:checked',
  );

  if (!selected.length) {
    alert("اختر سيارة واحدة على الأقل.");
    return false;
  }

  // حساب عدد أيام التأجير
  var startDate = new Date(document.getElementById("start_date").value);

  var endDate = new Date(document.getElementById("end_date").value);

  var days = (endDate - startDate) / 86400000;

  if (!Number.isFinite(days) || days <= 0) {
    alert("يرجى اختيار تاريخ نهاية بعد تاريخ البداية.");
    return false;
  }

  var prices = [];

  // الحصول على جسم جدول النتائج
  var resultRows = document.getElementById("resultRows");

  // حذف الصفوف القديمة عند إعادة إرسال النموذج
  resultRows.innerHTML = "";

  for (var i = 0; i < selected.length; i++) {
    var row = selected[i].closest("tr");

    var price = Number(
      row.querySelector(".daily-price").textContent.replace(/[^0-9]/g, ""),
    );

    prices.push(price);

    // إنشاء صف جديد في جدول النتائج
    var newRow = document.createElement("tr");

    var values = [
      selected[i].value,
      row.cells[1].textContent.trim(),
      days,
      price.toLocaleString("en-US") + " ل.س",
      (days * price).toLocaleString("en-US") + " ل.س",
    ];

    // إنشاء خلايا الصف
    for (var j = 0; j < values.length; j++) {
      var cell = document.createElement("td");
      cell.textContent = values[j];
      newRow.appendChild(cell);
    }

    // إضافة الصف إلى الجدول
    resultRows.appendChild(newRow);
  }

  // حساب التكلفة الإجمالية والخصم
  // نقوم بالتحويل الى object
  /**
   * مثلا بالشكل 
   * const cost = {
    price: 2500000,
    discount: 150000,
    total: 2350000
};
   */
  var cost = calculateRental(prices, days);

  // عرض المجموع قبل الخصم
  document.getElementById("resultSubtotal").textContent =
    cost.subtotal + " ل.س";

  // عرض نسبة الخصم
  document.getElementById("resultDiscountRate").textContent =
    days > 7 ? "(10%)" : "(0%)";

  // عرض قيمة الخصم
  document.getElementById("resultDiscount").textContent =
    cost.discount + " ل.س";

  // عرض المبلغ النهائي
  document.getElementById("resultTotal").textContent = cost.total + " ل.س";

  // إظهار النتائج
  $("#bookingResult").show();

  document.getElementById("bookingResult").focus();

  return false;
}
