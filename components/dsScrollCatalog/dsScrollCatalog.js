Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  behaviors: [],

  properties: {
    catalogBig: {
      type: Array,
      value: [],
      observer: function () {
      }
    },
    content: {
      type: Array,
      value: [],
      observer: function () { }
    }
  },
  data: {
    topArr: [],
    remedy: 0, // 补偿偏移量默认为二级标题的高
    toView: '',
    curTabIdx: 0
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  ready: function () {
    // 初始化大 tab
    console.log(this.data.catalogBig)
    let optionBig = this.data.catalogBig
    let catalogBig = []
    let len = optionBig.length
    while (len--) {
      let tempJson = {}
      tempJson.title = optionBig[len]
      tempJson.active = false
      tempJson.myclass = 'catalog-big'
      catalogBig.push(tempJson)
    }
    catalogBig.reverse()
    catalogBig[0].active = true
    catalogBig[0].myclass = 'catalog-big active'
    this.setData({
      catalogBig: catalogBig
    })
    // 初始化内容 content
    let content = []
    let len2 = optionBig.length
    while (len2--) {
      let tempJson = {}
      tempJson.title = optionBig[len2]
      tempJson.id = 'content_' + len2
      content.push(tempJson)
    }
    content.reverse()
    this.setData({
      content: content
    })
    // 计算top
    this.queryMultipleNodes()
    this.getSecondLevelH()
  },
  created: function () {},
  attached: function () {},
  moved: function () {},
  detached: function () {},

  methods: {
    onTap: function (e) {
      let temp = e.currentTarget.dataset.temp
      console.log(temp)
      console.log(typeof (temp))
      var myEventDetail = { myId: temp } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    onMyButtonTap: function () {

    },
    _myPrivateMethod: function () {

    },
    _propertyChange: function (newVal, oldVal) {

    },
    changeBig: function (e) {
      let idx = e.target.dataset.idx
      this.setBigTab(idx)
      this.setScroll(idx)
    },
    setBigTab: function (idx) {
      let arr = this.data.catalogBig
      let len = arr.length
      while (len--) {
        arr[len].active = false
        arr[len].myclass = 'catalog-big'
      }
      arr[idx].active = true
      arr[idx].myclass = 'catalog-big active'
      this.setData({
        catalogBig: arr
      })
      this.setData({
        curTabIdx: idx
      })
    },
    setScroll: function (idx) {
      const that = this
      let myKey = 'content_' + idx
      console.log(myKey)
      const abc = {
        [myKey]: function () {
          that.setData({
            toView: myKey
          })
        }
      }
      abc[myKey]()
    },
    scroll: function (e) {
      let curTop = e.detail.scrollTop
      // console.log('curTop---' + curTop)
      // if (curTop >= 0 && curTop < this.data.topArr[1] - this.data.remedy) {
      //   this.setBigTab(0)
      // }
      // if (curTop >= this.data.topArr[1] && curTop < this.data.topArr[2] - this.data.remedy) {
      //   this.setBigTab(1)
      // }
      // if (curTop >= this.data.topArr[2] && curTop < this.data.topArr[3] - this.data.remedy) {
      //   this.setBigTab(2)
      // }
      // if (curTop >= this.data.topArr[3] && curTop < this.data.topArr[4] - this.data.remedy) {
      //   this.setBigTab(3)
      // }
      // if (curTop >= this.data.topArr[4]) {
      //   this.setBigTab(4)
      // }
      let arr = this.data.topArr
      let remedy = this.data.remedy
      let len = arr.length
      arr[0] = 0
      for (let [i, elem] of arr.entries()) {
        if (i === (len-1)) {
          if (curTop >= arr[i]) {
            this.setBigTab(i)
            break
          }
        } else {
          if (curTop >= arr[i] && curTop < arr[i + 1] - remedy) {
            this.setBigTab(i)
            break
          }
        }
      }
    },
    queryMultipleNodes: function () {//声明节点查询的方法
      const that = this
      var query = wx.createSelectorQuery().in(this)//创建节点查询器 query
      query.selectAll('.getTop').boundingClientRect()//这段代码的意思是选择Id=the-id的节点，获取节点位置信息的查询请求
      query.exec(function (res) {
        console.log(res)
        let resArr = res[0]
        let tempArr = []
        for (let i = 0, len = resArr.length; i < len; i++) {
          tempArr.push(resArr[i].top)
        }
        console.log(tempArr) // #the-id节点的上边界坐标
        that.setData({
          topArr: tempArr
        })
      })
    },
    getSecondLevelH: function () {
      const that = this
      var query = wx.createSelectorQuery().in(this)
      query.selectAll('.second-level').boundingClientRect()
      query.exec(function (res) {
        // console.log(res)
        let myH = res[0][0].height
        console.log(myH)
        that.setData({
          remedy: myH
        })
      })
    }
  }
})