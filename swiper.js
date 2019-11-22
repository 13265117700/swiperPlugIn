class Count{
  constructor(props){
    this.state = {
      //容器得ID
      id: props.id,
      //当前第几项
      index:props.index,
      //滑动时长
      duration:props.duration,
      //偏移量
      translateX:props.translateX,
      //默认的醒目数量
      defaultLenght:props.defaultLenght,
      //单个项目长度
      itemWidth:props.itemWidth,
      //锁
      isLock:false,
    };

    this._init()
  }

  _init(){
    this._bind();
    this._clone();
  }

  _bind(){
    let swiperPrev = $(`#${this.state.id}`).find('.swiper-button-prev').get(0)
    let swiperNext = $(`#${this.state.id}`).find('.swiper-button-next').get(0)
    let that = this;

    swiperPrev.addEventListener('click',function(){
      let index = that.state.index;
      that._goIndex(index - 1)
    })

    swiperNext.addEventListener('click',function(){
      let index = that.state.index;
      that._goIndex(index + 1)
    })
  }

  _clone(){
    let swiperWrapper = $(`#${this.state.id}`).find('.swiper-wrapper').get(0);
    this.state.id = swiperWrapper;
    let swiperSlide = $(swiperWrapper).children().get();
    
    let firstItem = swiperSlide[0].cloneNode(true);
    let lastItem = swiperSlide[swiperSlide.length - 1].cloneNode(true);
    let index = this.state.index;
    let swiperItemWidth = swiperWrapper.offsetWidth;
    this.state.defaultLenght = swiperSlide.length;
    this.state.itemWidth = swiperItemWidth;
    this.state.translateX = -(swiperItemWidth + swiperItemWidth * index);

    console.log(this.state.translateX)

    swiperWrapper.appendChild(firstItem);
    swiperWrapper.prepend(lastItem);

    this._goIndex(index);
  }

  _goIndex(index){
    let swiperDuration = this.state.duration;
    let swiperWidth = this.state.itemWidth;
    let beginTranslateX = this.state.translateX;
    let endTranslateX = -(swiperWidth + swiperWidth * index);

    if(this.state.isLock){
      return
    }
    this.state.isLock = true;

    let swiperWrapper = this.state.id;
    let that = this;
    this.animateTo(beginTranslateX,endTranslateX,swiperDuration,function(value){
      swiperWrapper.style.transform = `translateX(${value}px)`
    },function(value){
      let swiperLenght = that.state.defaultLenght;
      if(index === -1){
        index = swiperLenght - 1;
        value = -(swiperWidth + swiperWidth * index);
      }
      if(index === swiperLenght){
        index = 0;
        value = -(swiperWidth + swiperWidth * index);
      }

      swiperWrapper.style.transform = `translateX(${value}px)`
      that.state.index = index;
      that.state.translateX = value;

      that.state.isLock = false;
    })
  }

  animateTo(begin,end,duration,changeCallback,finishCallback){
    let startTime = Date.now();
    let that = this;
    requestAnimationFrame(function update(){
      let dataNow = Date.now();
      let time = dataNow - startTime;
      let value = that.linear(time, begin, end, duration);
      typeof changeCallback === 'function' && changeCallback(value)
      if(startTime + duration >dataNow){
        requestAnimationFrame(update)
      }else{
        typeof finishCallback === 'function' && finishCallback(end)
      }
    })
  }
  
  linear(time,begin,end,duration){ 
    return ( end - begin ) * time / duration + begin;
  }
}

// const PAGE = {
//   data:{
//     swiper_1:null,
//     swiper_2:null,
//   },

//   init(){
//     this.initCount();
//   },

//   initCount(){
//     PAGE.data.swiper_1 = new Count({
//       id:'swiper_1',
//       index:0,
//       duration:500,
//       translateX:0,
//       defaultLenght:null,
//       itemWidth:null,
//     })

//     PAGE.data.swiper_2 = new Count({
//       id:'swiper_2',
//       index:0,
//       duration:500,
//       translateX:0,
//       defaultLenght:null,
//       itemWidth:null,
//     })
//   }
// }
// PAGE.init();