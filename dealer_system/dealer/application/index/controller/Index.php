<?php
namespace app\index\controller; //命名空间
use think\Controller;//引入控制器
use think\Db; //引入数据库
use think\Session; //引入session
use think\Log; //引入Log
use think\View; //引入session
use think\Paginator; //引入分页
class Index extends Controller{

    public function public_function(){

        if(Session::has('account')){//session存在
//            $this->success('登录超时', 'Index/login');


            $m =Db::name('dealers');

            $account = Session::get('account.account');

            $res = $m->where([
                'account'  =>  ['like',$account ],
            ])->find();

            if($res){

            }else{
                $this->success('当前用户不存在', 'Index/login');
            }




        }else{

            $this->success('请登录', 'Index/login');
        }

        //获取session
        $time = Session::get('account.create_time');
        $create_time = date("Y-m-d H:i:s", $time);

        $this->assign("account",Session::get('account.account'));
        $this->assign("name",Session::get('account.name'));
        $this->assign("gems",Session::get('account.gems'));
        $this->assign("all_gems",Session::get('account.all_gems'));

        $this->assign("privilege_level",Session::get('account.privilege_level'));
        $this->assign("create_time",$create_time);


        //获取配置access_url
        $access_url = \think\Config::get('access_url');

        $this->assign("access_url",$access_url);
        //个人中心
        $admin_page = $access_url."public/index/index/admin_page";
        $this->assign("admin_page",$admin_page);

//        代理个人中心
        $dealer_page = $access_url."public/index/index/dealer_page";
        $this->assign("dealer_page",$dealer_page);
//        密码修改
        $alter_pwd = $access_url."public/index/index/alter_pwd";
        $this->assign("alter_pwd",$alter_pwd);

        //代理管理
        //查询代理
        $search_dealer = $access_url."public/index/index/search_dealer";
        $this->assign("search_dealer",$search_dealer);
        //添加代理
        $add_dealer = $access_url."public/index/index/add_dealer";
        $this->assign("add_dealer",$add_dealer);

        //玩家管理
        $player_drilling = $access_url."public/index/index/player_drilling";
        $this->assign("player_drilling",$player_drilling);

        // 公告管理
        //代理公告管理
        $notice_manage = $access_url."public/index/index/notice_manage";
        $this->assign("notice_manage",$notice_manage);

        //游戏公告
        $game_notice_manage = $access_url."public/index/index/game_notice_manage";
        $this->assign("game_notice_manage",$game_notice_manage);

        //编辑代理公告
        $notice_manage_edit = $access_url."public/index/index/notice_manage_edit";
        $this->assign("notice_manage_edit",$notice_manage_edit);

        //编辑游戏公告
        $game_notice_manage_edit = $access_url."public/index/index/game_notice_manage_edit";
        $this->assign("game_notice_manage_edit",$game_notice_manage_edit);
    }

    public function log_add($text){



        $log_director = date("Y-m-d", time());
        $time = date("Y-m-d H:i:s", time());
        $content = trim($time) . " ";
        $content .= $text;
        $content = iconv('UTF-8', 'GB2312', $content);
        file_put_contents(APP_PATH . 'logs/' . $log_director . '.txt', $content . PHP_EOL, FILE_APPEND);


    }


    //    退出
    public function logout(){
//        dump(Session::get('account'));
//        dump(Session::get('account.account'));
        $res =  Session::clear();//返回NULL

            $this->redirect('index/login');


    }

    //    密码修改
    public function alter_pwd(){
        $this->public_function();
        return $this->fetch();
    }

    public function alter_pwd_msg(){

        $this->public_function();

        $account = Session::get('account.account');

        $data['account'] = $account;
        $data['password'] = md5($_POST['new']);
        $m =Db::name('dealers');

        $res = $m->where([
            'account'  =>  ['like',$account ],
        ])->find();

        $old = md5($_POST['old']);
        if($old == $res['password']){
            if($data['password'] == $res['password']){
                return 2; //与旧密码相同
            }else{
                $result = $m->update($data);
                if($result){
                    return 1;
                }else{
                    return 3;
                }
            }
        }else{
            return 4;//旧密码不对
        }



    }

    public function search_dealer(){



        $m =Db::name('dealers');

        $res = $m->where([
            'privilege_level'  =>  ['like',0],
        ])->select();
//        dump($res);


        $this->assign("dealers_list",$res);

        $this->public_function();
        return $this->fetch();
    }


    public function search_dealer_msg(){
        $this->public_function();

        $data = $_POST;
        $m =Db::name('dealers');
        $res = $m->where([
            'account'  =>  ['like',$_POST['account'] ],
        ])->find();
        $data['gems'] = $_POST['gems'] + $res['gems'];

        $result = $m->update($data);

        if($result){

            $content = Session::get('account.account')." ".Session::get('account.name')." 给 ".$res['account']." ".$res['name']."(原gems:".$res['gems'].") 充值(".$_POST['gems']."gems),充值后为:(".$data['gems']."gems)";
            $this->log_add($content);

            return 1;
        }else{
            return 2;
        }

    }



    public function search_dealer_delete_msg(){
        $this->public_function();

        $m =Db::name('dealers');
        $res = $m->where('account',$_POST['account'])->delete();

        if($res){
            $content = Session::get('account.account')." ".Session::get('account.name')." 将 ".$_POST['account']." ".$_POST['name']." 删除成功";
            $this->log_add($content);
            return 1;
        }else{
            $content = Session::get('account.account')." ".Session::get('account.name')." 将 ".$_POST['account']." ".$_POST['name']." 删除失败";
            $this->log_add($content);
            return 2;

        }


    }

//    新增代理
    public function add_dealer(){
        $this->public_function();
        return $this->fetch();
    }

    public function add_dealer_msg(){
        $this->public_function();

        $m =Db::name('dealers');
        $_POST['password'] = md5($_POST['password']);
        $res = $m->insert($_POST);

        if($res){
            return 1;
        }else{
            return 2;
        }
    }

    public function db($database){

        $config = \Think\Config::get($database);
        $db =  Db::connect($config);
        return $db;
    }

    public function player_drilling(){


        $this->public_function();


        $db = $this->db("mahjong_nodejs");//连接另一个数据库

        $m = $db->name("Users");

        $res = $m->select();

        $this->assign("list",$res);

        return $this->fetch();
    }


    public function player_drilling_msg(){

        $data = $_POST;
        $db = $this->db("mahjong_nodejs");//连接另一个数据库

        $m = $db->name("Users");
        $res = $m->where([
            'userid'  =>  ['like',$_POST['userid'] ],
        ])->find();

//        $data['userid'] = $res['userid'];
        $data['gems'] = $_POST['gems'] + $res['gems'];

//        return $data;

        $result = $m->update($data);
//        return $result;


        if($result){

            $content = Session::get('account.account')." ".Session::get('account.name')." 给 ".$res['account']." ".$res['name']."(原gems:".$res['gems'].") 充值(".$_POST['gems']."gems),充值后为:(".$data['gems']."gems)";
            $this->log_add($content);

            return 1;
        }else{
            return 2;
        }

    }




    public function notice_manage(){
        $this->public_function();

        $m =Db::name('dealers_notice');
        $res = $m->select();
        $this->assign("list_notice",$res);

        return $this->fetch();
    }


    public function player_drilling_freeze_msg(){
        $this->public_function();

        $data = $_POST;
        $db = $this->db("mahjong_nodejs");//连接另一个数据库

        $m = $db->name("Users");

        $freeze_time = $_POST['freeze_time'];

        $freeze_time = $freeze_time*24*60*60;

        $time = time();
//        $data['freeze_time1'] = $time;
//        $data['freeze_time2'] = $freeze_time;
        $data['freeze_time'] = $time + $freeze_time;
        $data['isfreeze'] = 1;

        $result = $m->update($data);
//        return $result;


        if($result){
            return 1;
        }else{
            return 2;
        }

    }

      public function player_drilling_unfreeze_msg(){
        $this->public_function();

        $data = $_POST;
        $db = $this->db("mahjong_nodejs");//连接另一个数据库

        $m = $db->name("Users");


        $data['freeze_time'] = 0;
        $data['isfreeze'] = 0;

        $result = $m->update($data);


        if($result){
            return 1;
        }else{
            return 2;
        }

    }


    public function notice_manage_edit(){
        $this->public_function();
        $m =Db::name('dealers_notice');

        $res = $m->where("id",$_GET['id'])->find();
        $this->assign("notice",$res);
        $this->assign("id",$_GET['id']);
        return $this->fetch();
    }

    public function game_notice_manage_edit(){
        $this->public_function();
        $db = $this->db("mahjong_nodejs");//连接另一个数据库

        $m = $db->name("Message");
        $res = $m->where("type",$_GET['type'])->find();
        $this->assign("notice",$res);
        $this->assign("type",$_GET['type']);
        return $this->fetch();
    }


    public function notice_manage_edit_msg(){
        $this->public_function();

        $data = $_POST;
        $m =Db::name('dealers_notice');

        $result = $m->update($data);

        if($result){
            return 1;
        }else{
            return 2;
        }


    }


    public function game_notice_manage_edit_msg(){
        $this->public_function();

        $data = $_POST;
        $db = $this->db("mahjong_nodejs");//连接另一个数据库

        $m = $db->name("Message");

        $result = $m->update($data);

        if($result){
            return 1;
        }else{
            return 2;
        }


    }



    public function game_notice_manage(){

        $this->public_function();
        $db = $this->db("mahjong_nodejs");//连接另一个数据库
        $m =$db->name('Message');
        $res = $m->select();
        $this->assign("list_notice",$res);
        return $this->fetch();

    }


    public function index(){

        $access_url = \think\Config::get('access_url');
        $url = $access_url."public/index/index/login";
        $this->assign("url",$url);
        return $this->fetch();

//        dump($url);
//        header("Location:$url");

//        return '<style type="text/css">*{ padding: 0; margin: 0; } .think_default_text{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:)</h1><p> ThinkPHP V5<br/><span style="font-size:30px">十年磨一剑 - 为API开发设计的高性能框架</span></p><span style="font-size:22px;">[ V5.0 版本由 <a href="http://www.qiniu.com" target="qiniu">七牛云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="http://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script><script type="text/javascript" src="http://ad.topthink.com/Public/static/client.js"></script><thinkad id="ad_bd568ce7058a1091"></thinkad>';
    }
    public function login(){
//                dump(Session::get('account.account'));//

//        dump(Session::get('account.account'));
//        dump(Session::get('account.account'));

        $access_url = \think\Config::get('access_url');
        $url = $access_url."public/index/index/login_msg";
        $this->assign("url",$url);
        return $this->fetch();
    }
    public function login_msg(){
        $account = $_POST["username"];
        $password = md5($_POST["password"]);
        $m =Db::name('dealers');

        $res = $m->where([
            'account'  =>  ['like',$account],
            'password' =>  ['like',$password],
        ])->find();
        if($res){
//            dump($res);
            Session::set('account',$res);
                    if($res['privilege_level'] == 999){//进入管理员界面
                        $this->success('登录成功', 'Index/admin_page');
                    }
                    if($res['privilege_level'] == 0){//进入代理界面
                        $this->success('登录成功', 'Index/dealer_page');
                    }
        }else{
            $this->success('登录失败', 'Index/login');
        }

    }
    public function admin_page(){


//        print_r(session('account')) ;
//        print_r(session('account')) ;
//        print_r(session('account')) ;
//        dump(session('account'));
//        dump(Session::get('account.account'));
//        dump(Session::get('account.account'));
//        dump(Session::get('account.account'));




        $this->public_function();




        return $this->fetch();
    }


    public function dealer_page(){


        $this->public_function();


        return $this->fetch();
    }
    public function header(){
        return $this->fetch();
    }
}
