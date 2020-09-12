Component({
  lifetimes: {
    attached: function () {
      this.scrollText()
    }
  },
  properties: {
    text: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    },
    speed:{
      type: String,
      value: ''
    }
  },
  data: {
    dspeed:3
  },
  methods: {
    //文字滚动方法
    scrollText: function () {
      var that = this
      var textlength = 0;

      for (var i = 0; i < this.data.text.length; i++) {
        if ((that.data.text.charCodeAt(i) >= 0x0001 && that.data.text.charCodeAt(i) <= 0x007e) || (0xff60 <= that.data.text.charCodeAt(i) && that.data.text.charCodeAt(i) <= 0xff9f)) {
          textlength++
        }
        else {
          textlength += 2;
        }
      }

      if(that.data.speed==''){
        var speed = that.data.dspeed
      }else{
        var speed = that.data.speed-0
      }

      textlength = textlength * 14+100    //根据文字大小填写,14为文字28rpx的1半,100为俩段文字的间距
      if (textlength > 50) {
        that.setData({ scrolltextmargin: 100 });//100为俩段文字的间距，需与45行一致
        var interval = setInterval(function () {
          if (that.data.scrolltextmovevalue < textlength) {
            that.setData({
              scrolltextmovevalue: that.data.scrolltextmovevalue + speed
            })
          }
          else {
            that.setData({
              scrolltextmovevalue: 0
            });
            clearInterval(interval);
            that.scrollText();
          }
        }, 30);
      } else {
        that.setData({ scrolltextmargin: '1000' });
      }
    },
  }
})
