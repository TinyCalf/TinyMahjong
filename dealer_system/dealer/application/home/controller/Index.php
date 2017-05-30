<?php
namespace app\home\controller; //命名空间
use think\Controller;//引入控制器
use think\Db; //引入数据库
use think\Paginator; //引入分页
class Index extends Controller{

    public function index(){
//        fetch   渲染模板输出
//display     渲染内容输出
//assign  模板变量赋值
//engine  初始化模板引擎

//        $res = Db::name('user')->select();
//        dump($res);
//
//        $data['id'] = 3;
//        $data['user_name'] = rand(0,9);
//        $data['password'] = md5(rand(0,1));
//        $res = Db::name('user')->insert($data);
//
////        $res = Db::name('user')->delete(4);
//        $res = Db::name('user')->update($data);
//        dump($res);


//        dump($data);
//        return $this->fetch();
        $list = Db::name('user')->paginate(1);

//        dump($list);
        $page = $list->render();

        $this->assign('_list',$list);

        $this->assign('_page',$page);

        return $this->fetch();
    }

    public function login(){
        return $this->fetch();
    }


}


?>
