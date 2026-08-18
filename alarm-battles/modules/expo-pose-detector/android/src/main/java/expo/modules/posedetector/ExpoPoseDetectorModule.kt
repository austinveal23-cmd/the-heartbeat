package expo.modules.posedetector

import android.graphics.BitmapFactory
import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.pose.Pose
import com.google.mlkit.vision.pose.PoseDetection
import com.google.mlkit.vision.pose.PoseLandmark
import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private class ImageDecodeException(uri: String) :
  CodedException("ERR_POSE_IMAGE_DECODE", "Could not decode image at $uri", null)

/**
 * Runs ML Kit Pose Detection against a single still image (from expo-camera's
 * periodic takePictureAsync snapshots), rather than a live camera frame
 * stream. This trades real-time frame-rate detection for a much simpler,
 * more stable integration for a first spike — see src/motion/README.md.
 */
class ExpoPoseDetectorModule : Module() {
  private val detector by lazy {
    val options = PoseDetectorOptions.Builder()
      .setDetectorMode(PoseDetectorOptions.SINGLE_IMAGE_MODE)
      .build()
    PoseDetection.getClient(options)
  }

  override fun definition() = ModuleDefinition {
    Name("ExpoPoseDetector")

    AsyncFunction("detectPose") { imageUri: String, promise: Promise ->
      val path = Uri.parse(imageUri).path ?: imageUri
      val bitmap = BitmapFactory.decodeFile(path)
      if (bitmap == null) {
        promise.reject(ImageDecodeException(imageUri))
        return@AsyncFunction
      }

      val image = InputImage.fromBitmap(bitmap, 0)
      detector.process(image)
        .addOnSuccessListener { pose -> promise.resolve(serializePose(pose)) }
        .addOnFailureListener { e ->
          promise.reject(CodedException("ERR_POSE_DETECTION", e.message, e))
        }
    }

    OnDestroy {
      detector.close()
    }
  }

  private fun serializePose(pose: Pose): Map<String, Any>? {
    if (pose.allPoseLandmarks.isEmpty()) return null

    val landmarks = mutableMapOf<String, Any>()
    for ((type, name) in TRACKED_LANDMARKS) {
      val lm = pose.getPoseLandmark(type) ?: continue
      landmarks[name] = mapOf(
        "x" to lm.position.x.toDouble(),
        "y" to lm.position.y.toDouble(),
        "z" to lm.position3D.z.toDouble(),
        "inFrameLikelihood" to lm.inFrameLikelihood.toDouble()
      )
    }
    return mapOf("landmarks" to landmarks)
  }

  companion object {
    // Keep in sync with src/motion/landmarks.ts POSE_LANDMARK_NAMES.
    private val TRACKED_LANDMARKS = listOf(
      PoseLandmark.NOSE to "nose",
      PoseLandmark.LEFT_SHOULDER to "left_shoulder",
      PoseLandmark.RIGHT_SHOULDER to "right_shoulder",
      PoseLandmark.LEFT_ELBOW to "left_elbow",
      PoseLandmark.RIGHT_ELBOW to "right_elbow",
      PoseLandmark.LEFT_WRIST to "left_wrist",
      PoseLandmark.RIGHT_WRIST to "right_wrist",
      PoseLandmark.LEFT_HIP to "left_hip",
      PoseLandmark.RIGHT_HIP to "right_hip",
      PoseLandmark.LEFT_KNEE to "left_knee",
      PoseLandmark.RIGHT_KNEE to "right_knee",
      PoseLandmark.LEFT_ANKLE to "left_ankle",
      PoseLandmark.RIGHT_ANKLE to "right_ankle"
    )
  }
}
