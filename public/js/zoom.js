var addZoom = function (target) {
  var container = document.getElementById(target),
      imgsrc = container.currentStyle || window.getComputedStyle(container, false),
      imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, ""),
      img = new Image();
	
	var lbimage = document.getElementById("lb-img")
  img.src = imgsrc;
  img.onload = function () {
    var imgWidth = img.naturalWidth,
        imgHeight = img.naturalHeight
	if(imgWidth < imgHeight){
		var ratio = imgHeight / imgWidth
	}else{
		var ratio = imgWidth / imgHeight
	}
	var percentage = ratio * 50 + '%';

    container.onmousemove = function (e) {
      var boxWidth = lbimage.clientWidth,
		  boxHeight = lbimage.clientHeight,
          xPos = e.pageX - this.offsetLeft,
          yPos = e.pageY - this.offsetTop,
          xPercent = xPos / (boxWidth / 100) + '%',
          yPercent = yPos / (boxHeight / 100) + '%';
	
		if(imgWidth < imgHeight){
			Object.assign(container.style, {
				backgroundPosition: xPercent + ' ' + yPercent,
				backgroundSize: imgWidth + 'px'
			});
		}else{
			Object.assign(container.style, {
				backgroundPosition: xPercent + ' ' + yPercent,
				backgroundSize: imgHeight + 'px'
			});
		}
    };

    container.onmouseleave = function (e) {
      Object.assign(container.style, {
        backgroundPosition: 'center',
        backgroundSize: 'contain'
      });
    };
  }
};

window.addEventListener("load", function(){
  addZoom("magnify");
});