// 分页函数
function pages (total, page = 1, size = 10, search = '') {
	// 计算开始位置、结束位置
	let start = (page - 1) * size
	let totalPages = Math.ceil(total / size)
	// 展示分页效果
	let show = ''
	show += `<a href="?search=${search}&page=1">首页</a>`
    show += `<a href="?search=${search}&page=${ parseInt(page) - 1 >= 1 ? parseInt(page) - 1 : 1 }">上一页</a>`
    show += `<span class="current">${page}</span>`
    show += `<a href="?search=${search}&page=${ parseInt(page) + 1 <= totalPages ? parseInt(page) + 1 : totalPages }">下一页</a>`
    show += `<a href="?search=${search}&page=${totalPages}">尾页</a>`
    return {
    	start: start,
    	size: size,
    	show: show
    }
}

module.exports = pages