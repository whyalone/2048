$(document).ready(function() {

	var all = {}; //存储json

	for(var i = 0; i < 16; i++) {
		all['c' + (i + 1)] = {
			'obj': null,
			'pos': 'c' + (i + 1),
			'left': 11 + (i % 4) * 80,
			'top': 11 + (Math.floor(i / 4)) * 110,
			'num': 0,
		}
	}
	
	random_creat('init');

	$(document).keyup(function(ev) {
		calculate(ev.which);
		if(ev.which >= 37 && ev.which <= 40) {
			$(document).off('keyup');
		}

	});

	//创建随机的cube str:move/init
	function random_creat(str) {
		var creat_num = 0;
		var creat_pool = [];
		var creat_div = [];
		if(str == 'init') {
			creat_num = 3;
		} else if(str == 'move') {
			creat_num = 1;
		} else {
			alert('random_creat 传入参数str有误')
		}

		for(var i = 0; i < 16; i++) {
			if(all['c' + (i + 1)].num == 0) {
				creat_pool.push('c' + (i + 1))
			}
		} //可精简代码

		while(creat_div.length < creat_num) {
			var random_arr = creat_pool[parseInt(Math.random() * creat_pool.length)];
			if($.inArray(random_arr, creat_div) == -1) {
				creat_div.push(random_arr);
			}
		}

		for(var i = 0; i < creat_div.length; i++) {
			var oDiv = $('<div></div>');
			var num = Math.random()
			num > 0.3 ? num = 2 : num = 4;

			oDiv.css({
				'top': all[creat_div[i]].top,
				'left': all[creat_div[i]].left,
				'background-image': 'url(img/cube_' + num + '.png)'
			})

			all[creat_div[i]].num = num;
			all[creat_div[i]].obj = oDiv;
			$('.warp').append(oDiv)
		}
	}
	//计算
	function calculate(num) {
		var move_step = 0;
		var cal_order = [];
		if(num == 37) {
			cal_order = [
				['c1', 'c2', 'c3', 'c4'],
				['c5', 'c6', 'c7', 'c8'],
				['c9', 'c10', 'c11', 'c12'],
				['c13', 'c14', 'c15', 'c16']
			];
		} else if(num == 38) {
			cal_order = [
				['c1', 'c5', 'c9', 'c13'],
				['c2', 'c6', 'c10', 'c14'],
				['c3', 'c7', 'c11', 'c15'],
				['c4', 'c8', 'c12', 'c16']
			]
		} else if(num == 39) {
			cal_order = [
				['c4', 'c3', 'c2', 'c1'],
				['c8', 'c7', 'c6', 'c5'],
				['c12', 'c11', 'c10', 'c9'],
				['c16', 'c15', 'c14', 'c13']
			]
		} else if(num == 40) {
			cal_order = [
				['c13', 'c9', 'c5', 'c1'],
				['c14', 'c10', 'c6', 'c2'],
				['c15', 'c11', 'c7', 'c3'],
				['c16', 'c12', 'c8', 'c4']
			]
		} else {
			return false;
		}

		for(var i = 0; i < 4; i++) {
			var plus = 0;
			var plus_arr = [];

			for(var j = 0; j < 4; j++) {
				var tar = 0;
				var isplus = false;

				if(all[cal_order[i][j]].num != 0) { //需要移动的

					for(var k = j - 1; k > -1; k--) { //计算有多少个0
						if(all[cal_order[i][k]].num == 0) {
							tar++;
						}
					}

					for(var h = j - 1; h > -1; h--) { //计算相加
						if(all[cal_order[i][h]].num != 0) {
							if($.inArray(cal_order[i][h], plus_arr) == -1 && all[cal_order[i][j]].num == all[cal_order[i][h]].num) {
								plus_arr.push(cal_order[i][j], cal_order[i][h]);
								isplus = true;
								plus++;
							}
							break; //只判断找到的第一个数字
						}
					}

					if(cal_order[i][j] != cal_order[i][j - tar - plus]) {
						move_step++;
						move(cal_order[i][j], cal_order[i][j - tar - plus], isplus);
					} else {
						console.log('不移动')
					}

				}
			}
		}
		console.log(move_step+'move_step')
		setTimeout(function() {
			if(move_step > 0) {
				random_creat('move');
			} else {
				game_over();
			}

			$(document).keyup(function(ev) {
				calculate(ev.which);
				if(ev.which >= 37 && ev.which <= 40) {
					$(document).off('keyup');
				}
			});

		}, 500);

	}

	function move(cube, target, isplus) {


		all[cube].obj.stop();

		all[cube].obj.css('z-index', '0').animate({
			'left': all[target].left,
			'top': all[target].top,
		}, 300, function() {
			if(isplus) { //相加
				all[target].num = parseInt(all[cube].num) + all[target].num;

				all[cube].obj.remove();

				all[cube].obj = null;
				all[cube].num = 0;

				all[target].obj.css({
					'background-image': 'url(img/cube_' + all[target].num + '.png)'
				});
			} else if(!isplus) { //不相加
				all[target].obj = all[cube].obj;
				all[target].num = all[cube].num;

				all[cube].obj = null;
				all[cube].num = 0;

				all[target].obj.css('z-index', '1');
			} else {
				alert('isplus传入有误')
			}

		})

	}

	function game_over() {
		var isover = true;
		for(var i = 1; i < 17; i++) {
			if(all['c' + i].num==0){
				isover = false;
				console.log(isover)
			}
			if(all['c' + (i - 1)] && all['c' + (i - 1)].num == all['c' + i].num && $.inArray(i,[5,9,13])==-1) {
				isover = false;
				console.log(isover)
			}
			if(all['c' + (i + 1)] && all['c' + (i + 1)].num == all['c' + i].num && $.inArray(i,[4,8,12])==-1) {
				isover = false;
				console.log(isover)
				
			}
			if(all['c' + (i - 4)] && all['c' + (i - 4)].num == all['c' + i].num) {
				isover = false;
				console.log(isover)
				
			}
			if(all['c' + (i + 4)] && all['c' + (i + 4)].num == all['c' + i].num) {
				isover = false;
				console.log(isover)
				
			}
		}
		
		if(isover){
			alert('游戏结束')
		}
	}

})