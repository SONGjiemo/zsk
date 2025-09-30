
$(function(){function purchaseProductClick(){$('.btn-ceo-purchase-product').off('click').click(function(){let btnLoading=Ladda.create(this);btnLoading.start()
let checkInterval=null
let _UIKit=UIkit
let product_id=$(this).data('product-id')
let flush=$(this).data('flush')
if($(this).data('type')=='open'){$.post(zongcai.ajaxurl,{action:'ceo_shop_pay_product_download',product_id:product_id,sku:$(this).data('sku')},function(res){btnLoading.stop()
btnLoading.remove()
if(res.success){_UIKit.notification(res.data,{status:'success'})
window.setTimeout(function(){window.location.reload()},1500)}else{_UIKit.notification(res.data,{status:'warning'})}})
return}
let url=zongcai.ajaxurl+'?action=ceo_shop_pay_product&product_id='+product_id
if($(this).data('sku')){url+='&sku='+$(this).data('sku')}
if($(this).data('type')=='download'){url+='&download=1'}
$.ajax({url:url,method:'GET',success:function(res){$('#ceoshop-member-box').html(res)
btnLoading.stop()
btnLoading.remove()
_UIKit.modal('#ceo-purchase-pay').show()
_UIKit.util.on('#ceo-purchase-pay','hidden',function(){$('#ceoshop-member-box').html()
$('#ceo-purchase-pay').remove()});$('#submit-ceo-product3').click(function(){let btnLoading=Ladda.create(this);btnLoading.start()
$.ajax({url:zongcai.ajaxurl+'?action=ceo_shop_pay_product_download&product_id='+product_id+'&sku='+$('#ceo-product-sku').val(),method:'GET',success:function(res){$('#ceoshop-member-box').html(res)
_UIKit.modal('#ceo-download').show()
_UIKit.util.on('#ceo-download','hidden',function(){$('#ceoshop-member-box').html()
$('#ceo-download').remove()});btnLoading.stop()
btnLoading.remove()}})})
$('#ceo-purchase-pay .increase').click(function(){$('#ceo-product-inventory').val(parseInt($('#ceo-product-inventory').val())+1)
$('#ceo-product-price').val(Decimal.mul(parseFloat($('#ceo-product-sku-price').val()),parseInt($('#ceo-product-inventory').val())).toFixed(2,Decimal.ROUND_DOWN))
calcRealPay()
calcVipDiscount()})
$('#ceo-purchase-pay .decrease').click(function(){let num=parseInt($('#ceo-product-inventory').val())
if(num-1<1){$('#ceo-product-inventory').val(1)}else{$('#ceo-product-inventory').val(num-1)}
$('#ceo-product-price').val(Decimal.mul(parseFloat($('#ceo-product-sku-price').val()),parseInt($('#ceo-product-inventory').val())).toFixed(2,Decimal.ROUND_DOWN))
calcRealPay()
calcVipDiscount()})
$('.product-sku-select').click(function(){$('.product-sku-select').removeClass('select')
$(this).addClass('select')
$('#product-current-price').text($(this).data('ori-price'))
$('#product-current-inventory').text($(this).data('inventory'))
$('#product-current-freight').text($(this).data('freight'))
$('#ceo-product-freight').val($(this).data('freight'))
$('#ceo-product-sku').val($(this).data('sku'))
$('#ceo-product-sku-discount').val($(this).data('discount'))
$('#ceo-product-sku-price').val($(this).data('price'))
$('#ceo-product-sku-ori-price').val($(this).data('ori-price'))
if($(this).data('download')==-1){$('#ceo-product-sku-price').val($(this).data('ori-price'))}
calcVipDiscount()
$('#ceo-product-price').val(Decimal.mul(parseFloat($('#ceo-product-sku-price').val()),parseInt($('#ceo-product-inventory').val())).toFixed(2,Decimal.ROUND_DOWN))
calcRealPay()
if($(this).data('download')=='1'||$(this).data('download')=='2'){$('#submit-ceo-product').hide()
$('#submit-ceo-product2').hide()
$('#submit-ceo-product3').show()}else{if($(this).data('exclusive')=='1'&&$('#ceo-user-vip').val()==-1){$('#submit-ceo-product').hide()
$('#submit-ceo-product2').show()
$('#submit-ceo-product3').hide()}else{$('#submit-ceo-product').show()
$('#submit-ceo-product2').hide()
$('#submit-ceo-product3').hide()}}
if($(this).data('download')=='-1'){$('.submit-ceo-product-tip').show()}else{$('.submit-ceo-product-tip').hide()}})
$('.product-pay-payment').click(function(){$('.product-pay-payment').removeClass('select')
$(this).addClass('select')
$('#ceo-product-payment').val($(this).data('payment'))
calcRealPay()})
$('#product-use-coupon').click(function(){let btnLoading=Ladda.create(this);btnLoading.start()
let code=$('#product-use-coupon-code').val()
$.ajax({url:zongcai.ajaxurl+'?action=ceo_shop_pay_discount_coupon&code='+code+'&product_id='+product_id,method:'GET',success:function(res){btnLoading.stop()
btnLoading.remove()
if(res.success){$('#ceo-product-discount').val(parseFloat(res.data.money))
$('#ceo-product-discount-condition').val(parseFloat(res.data.condition_money))
$('#product-show-discount-code').html('<span>'+res.data.title+'</span><em>- '+res.data.money+'</em>')
calcRealPay(!0)}else{$('#ceo-product-discount').val('0.00')
$('#ceo-product-discount-condition').val('0.00')
$('#product-show-discount-code').html('')
$('#product-use-coupon-code').val('')
calcRealPay()
_UIKit.notification(res.data,{status:'warning'})}},error:function(){console.log('检测订单支付状态时发生错误！')}})})
$('#submit-ceo-product').click(function(){let btnLoading=Ladda.create(this);btnLoading.start()
const data={action:'ceo_shop_pay_product',payment:$('#ceo-product-payment').val(),product_id:product_id,sku:$('#ceo-product-sku').val(),inventory:$('#ceo-product-inventory').val(),coupon_code:$('#product-use-coupon-code').val(),buyer_mail:$('#ceo-product-mail').val(),buyer_addr:$('#ceo-product-buyer-addr').val(),buyer_remark:$('#ceo-product-buyer-remark').val(),nonce:$('#ceo-product-nonce').val(),}
$.post(zongcai.ajaxurl,data,function(res){if(res.success){if(res.data.pay_status==0){if(res.data.pay_url){if(/Mobi|Android|iPhone/i.test(navigator.userAgent)){window.location.href=res.data.pay_url}else{window.open(res.data.pay_url)}}
if(res.data.jssdk){if(typeof WeixinJSBridge=="undefined"){if(document.addEventListener){document.addEventListener('WeixinJSBridgeReady',onBridgeReady,!1)}else if(document.attachEvent){document.attachEvent('WeixinJSBridgeReady',onBridgeReady);document.attachEvent('onWeixinJSBridgeReady',onBridgeReady)}}else{WeixinJSBridge.invoke('getBrandWCPayRequest',res.data.jssdk,function(res){if(res.err_msg=="get_brand_wcpay_request:ok"){}})}}
if(res.data.qr_code){$('#ceoshop-member-box').html(res.data.html)
_UIKit.modal('#ceo-payment-wrap').show()
_UIKit.util.on('#ceo-payment-wrap','hidden',function(){$('#ceoshop-member-box').html()
$('#ceo-payment-wrap').remove()})}
setTimeout(function(){check(res.data.order_sn,data.sku)},1000)}else{btnLoading.stop()
btnLoading.remove()
UIkit.notification('订单支付成功！',{status:'success'})
window.setTimeout(function(){if(flush==1){openDownloadPage(product_id,data.sku)}else{window.location.reload()}},1500)}}else{btnLoading.stop()
btnLoading.remove()
UIkit.notification(res.data,{status:'warning'})}})})}})
function calcVipDiscount(){$('#product-ori-total').text(Decimal.mul($('#product-current-price').text(),$('#ceo-product-inventory').val()).toFixed(2,Decimal.ROUND_DOWN)+" "+$('#ceo-currency-name').val())
$("#ceo-product-all-vip-discount li").each(function(){let tempVipDiscount=parseFloat($(this).data('discount-arr').split(',')[$('#ceo-product-sku').val()-1]);let tempVipDiscountPrice=Decimal.mul($('#product-current-price').text(),$('#ceo-product-inventory').val()).mul(tempVipDiscount).div(10).toFixed(2,Decimal.ROUND_DOWN);if(tempVipDiscount==0){$(this).children('p').html('免费')}else{$(this).children('p').html('<em>'+tempVipDiscountPrice+" "+$('#ceo-currency-name').val()+'</em>'+tempVipDiscount+'折')}})
if($('#ceo-user-vip').val()!=-1&&$('#ceo-product-sku-discount').val()!=10){let tempDiscountPrice=Decimal.mul(parseInt($('#ceo-product-inventory').val()),Decimal.sub(parseFloat($('#ceo-product-sku-ori-price').val()),parseFloat($('#ceo-product-sku-price').val()))).toFixed(2,Decimal.ROUND_DOWN)
if($('#ceo-product-sku-discount').val()==0){$('#product-show-discount-vip').html('<span>'+$('#ceo-user-vip-name').val()+'免费</span><em>- '+tempDiscountPrice+" "+$('#ceo-currency-name').val()+'</em>')}else{$('#product-show-discount-vip').html('<span>'+$('#ceo-user-vip-name').val()+'优惠'+$('#ceo-product-sku-discount').val()+'折</span><em>- '+tempDiscountPrice+" "+$('#ceo-currency-name').val()+'</em>')}}}
function calcRealPay(tip=!1){let tempTotalPrice=parseFloat($('#ceo-product-price').val())
if(parseFloat($('#ceo-product-discount').val())>0){let sumPrice=Decimal.add(parseFloat($('#ceo-product-price').val()),parseFloat($('#ceo-product-freight').val())).toFixed(2,Decimal.ROUND_DOWN);if(parseFloat(sumPrice)<parseFloat($('#ceo-product-discount-condition').val())){_UIKit.notification('此代金券最低使用门槛'+$('#ceo-product-discount-condition').val(),{status:'warning'})
$('#ceo-product-discount').val('0.00')
$('#ceo-product-discount-condition').val('0.00')
$('#product-show-discount-code').html('')
$('#product-use-coupon-code').val('')}else{if(tip){_UIKit.notification('代金券使用成功',{status:'success'})}
tempTotalPrice=Decimal.sub(parseFloat($('#ceo-product-price').val()),parseFloat($('#ceo-product-discount').val())).toFixed(2,Decimal.ROUND_DOWN)}}
if($('#ceo-product-payment').val()!='balance'){tempTotalPrice=Decimal.div(parseFloat(tempTotalPrice),parseFloat($('#ceo-product-proportion').val())).toFixed(2,Decimal.ROUND_DOWN)}
tempTotalPrice=Decimal.add(parseFloat(tempTotalPrice),parseFloat($('#ceo-product-freight').val())).toFixed(2,Decimal.ROUND_DOWN)
if(tempTotalPrice<0){tempTotalPrice='0.00'}
if($('#ceo-product-payment').val()!='balance'){$('#ceo_price').html('￥<span id="ceo-product-total">'+tempTotalPrice+'</span>')}else{$('#ceo_price').html('&nbsp;<span id="ceo-product-total">'+tempTotalPrice+'</span> '+$('#ceo-currency-name').val())}}
function check(orderSn,sku){$.ajax({url:zongcai.ajaxurl+'?action=ceo_shop_pay_product_check&order_sn='+orderSn,method:'GET',success:function(res){if(res.success){UIkit.notification('订单支付成功！',{status:'success'})
window.setTimeout(function(){if(flush==1){openDownloadPage(product_id,sku)}else{window.location.reload()}},1500)}else{console.log('订单支付仍在进行中...')
setTimeout(function(){check(orderSn,sku)},1000)}},error:function(){console.log('检测订单支付状态时发生错误！')
setTimeout(function(){check(orderSn,sku)},1000)}})}})}
window.purchaseProductClick=purchaseProductClick;purchaseProductClick();function openDownloadPage(product_id,sku_id){$.ajax({url:zongcai.ajaxurl+'?action=ceo_shop_pay_product_download&product_id='+product_id+'&sku='+sku_id,method:'GET',success:function(res){$('#ceoshop-member-box').html(res)
UIkit.modal('#ceo-download').show()
UIkit.util.on('#ceo-download','hidden',function(){$('#ceoshop-member-box').html()
$('#ceo-download').remove()})}})}
$('.btn-ceo-purchase-change-video').off('click').click(function(){let product_id=$(this).data('product-id')
let sku=$(this).data('sku')
let _this=$(this)
$.ajax({url:zongcai.ajaxurl+'?action=ceo_shop_pay_change_video&product_id='+product_id+'&sku='+sku,method:'GET',success:function(res){$('#ceo-video-s').html(res)
purchaseProductClick()
$('.ceo-video-list-xinxi-down .btn-ceo-purchase-product').data('sku',sku)
$(".ceo-video-list-liebiao-box li div").removeClass('ceo-video-list-liebiao-s')
$(".ceo-video-list-liebiao-box li div a").removeClass('ceo-video-list-liebiao-d')
$(".ceo-video-list-liebiao-box li div i").removeClass().addClass('ceofont icon-play')
if(_this.hasClass('video_link_play')){_this.prev().addClass('ceo-video-list-liebiao-d')
_this.prev().children().removeClass().addClass('icon-video')
_this.addClass('ceo-video-list-liebiao-d')}else{_this.addClass('ceo-video-list-liebiao-d')
_this.children().removeClass().addClass('icon-video')
_this.next().addClass('ceo-video-list-liebiao-d')}
if(jQuery('.ckplayer-video').length){jQuery('.ckplayer-video').each(function(){jQuery(this).height(jQuery(this).width()*0.5678)})}
if(jQuery(".ckplayer-video-real").length){jQuery(".ckplayer-video-real").bind('contextmenu',function(){return!1});jQuery(".ckplayer-video-real").each(function(){var conv=jQuery(this).data("video")
conn=jQuery(this).data("nonce");console.log(conn,conv)
new ckplayer({container:"#ckplayer-video-"+conn,variable:"player"+conn,autoplay:!1,video:conv})})}
if(jQuery(".dplayer-video-real").length){jQuery(".dplayer-video-real").bind('contextmenu',function(){return!1});jQuery(".dplayer-video-real").each(function(){var conv=jQuery(this).data("video")
conn=jQuery(this).data("nonce");if(jQuery(this).hasClass("video-blob")){jQuery(".article-video").append("<div class='article-video-loading' style='z-index: 9;position: absolute;top: calc(50% - 12px);left: 0;right: 0;color: #fff;font-size: 16px;text-align: center;'>视频加载中...</div>");window.URL=window.URL||window.webkitURL;var xhr=new XMLHttpRequest();xhr.open("GET",conv,!0);xhr.responseType="blob";xhr.timeout=1000*60*1;xhr.onload=function(e){if(this.status==200){var blob=this.response;jQuery(".article-video-loading").remove();new DPlayer({container:document.getElementById("dplayer-video-"+conn),screenshot:!0,autoplay:!1,video:{url:window.URL.createObjectURL(blob),pic:'',thumbnails:'',type:'auto'}})}}
xhr.send()}else{new DPlayer({container:document.getElementById("dplayer-video-"+conn),screenshot:!0,autoplay:!1,video:{url:conv,pic:'',thumbnails:'',type:'auto'}})}})}}})})});


