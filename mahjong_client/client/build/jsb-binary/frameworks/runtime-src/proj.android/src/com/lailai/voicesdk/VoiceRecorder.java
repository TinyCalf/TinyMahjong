package com.lailai.voicesdk;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import android.media.MediaRecorder;
import android.os.Environment;

public class VoiceRecorder {

	private static MediaRecorder mRecorder;
	private static String mDirString;
	private static String mCurrentFilePathString;

	private static boolean isPrepared;// 鏄惁鍑嗗濂戒簡

	/**
	 * 鍥炶皟鍑芥暟锛屽噯澶囧畬姣曪紝鍑嗗濂藉悗锛宐utton鎵嶄細寮�濮嬫樉绀哄綍闊虫
	 * 
	 * @author nickming
	 *
	 */
	public interface AudioStageListener {
		void wellPrepared();
	}

	public static AudioStageListener mListener;

	public static void setOnAudioStageListener(AudioStageListener listener) {
		mListener = listener;
	}
	
	public static void setStorageDir(String fileDir){
		mDirString = fileDir;
	}
	
	public static String getStorageDir(){
		return mDirString;
	}

	// 鍑嗗鏂规硶
	public static void prepare(String fileNameString) {
		try {
			// 涓�寮�濮嬪簲璇ユ槸false鐨�
			isPrepared = false;

			File dir = new File(mDirString);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			File file = new File(dir, fileNameString);

			mCurrentFilePathString = file.getAbsolutePath();

			mRecorder = new MediaRecorder();
			// 璁剧疆杈撳嚭鏂囦欢
			mRecorder.setOutputFile(file.getAbsolutePath());
			// 璁剧疆meidaRecorder鐨勯煶棰戞簮鏄害鍏嬮
			mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
			mRecorder.setAudioEncodingBitRate(4750);
			// 璁剧疆鏂囦欢闊抽鐨勮緭鍑烘牸寮忎负amr
			mRecorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_NB);
			// 璁剧疆闊抽鐨勭紪鐮佹牸寮忎负amr
			mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

			// 涓ユ牸閬靛畧google瀹樻柟api缁欏嚭鐨刴ediaRecorder鐨勭姸鎬佹祦绋嬪浘
			mRecorder.prepare();

			mRecorder.start();
			// 鍑嗗缁撴潫
			isPrepared = true;
			// 宸茬粡鍑嗗濂戒簡锛屽彲浠ュ綍鍒朵簡
			if (mListener != null) {
				mListener.wellPrepared();
			}

		} catch (IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	/**
	 * 闅忔満鐢熸垚鏂囦欢鐨勫悕绉�
	 * 
	 * @return
	 */
	private static String generalFileName() {
		// TODO Auto-generated method stub

		return UUID.randomUUID().toString() + ".amr";
	}

	// 鑾峰緱澹伴煶鐨刲evel
	public static int getVoiceLevel(int maxLevel) {
		// mRecorder.getMaxAmplitude()杩欎釜鏄煶棰戠殑鎸箙鑼冨洿锛屽�煎煙鏄�1-32767
		if (isPrepared && mRecorder!=null) {
			try {
				// 鍙栬瘉+1锛屽惁鍒欏幓涓嶅埌7
				return maxLevel * mRecorder.getMaxAmplitude() / 32768 + 1;
			} catch (Exception e) {
				// TODO Auto-generated catch block

			}
		}

		return 1;
	}

	// 閲婃斁璧勬簮
	public static void release() {
		// 涓ユ牸鎸夌収api娴佺▼杩涜
		if(mRecorder != null){
			mRecorder.stop();
			mRecorder.release();
			mRecorder = null;			
		}
	}

	// 鍙栨秷,鍥犱负prepare鏃朵骇鐢熶簡涓�涓枃浠讹紝鎵�浠ancel鏂规硶搴旇瑕佸垹闄よ繖涓枃浠讹紝
	// 杩欐槸涓巖elease鐨勬柟娉曠殑鍖哄埆
	public static void cancel() {
		release();
		if (mCurrentFilePathString != null) {
			File file = new File(mCurrentFilePathString);
			file.delete();
			mCurrentFilePathString = null;
		}

	}

	public static String getCurrentFilePath() {
		// TODO Auto-generated method stub
		return mCurrentFilePathString;
	}

}
