<?php
namespace app\admin\controller;
use think\Controller;
class Index extends Controller{

    public function index(){
//        fetch   渲染模板输出
//display     渲染内容输出
//assign  模板变量赋值
//engine  初始化模板引擎
        return $this->fetch();
    }


}


?>