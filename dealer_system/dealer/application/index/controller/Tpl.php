<?php
namespace app\index\controller; //命名空间
use think\Controller;//引入控制器
use think\Db; //引入数据库
use think\Session; //引入session
use think\View; //引入session
use think\Paginator; //引入分页
class Tpl extends Controller{

    public function index(){

        return $this->fetch();


    }

    public function header(){

//        $name = Session::get('account.name');
//        $this->assign("name",$name);
//        return $this->fetch("header");


    }


    public function left(){


//        $this->assign("privilege_level",Session::get('account.privilege_level'));

        return $this->fetch();


    }

}