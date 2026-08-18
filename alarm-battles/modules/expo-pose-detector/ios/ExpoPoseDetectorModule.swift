import ExpoModulesCore
import MLKitPoseDetection
import MLKitVision
import UIKit

/// Best-effort iOS counterpart to the Android module (see the .kt file for
/// the reasoning behind single-image detection over a live frame stream).
/// This has not been compiled/run — it needs verification against the
/// exact GoogleMLKit/PoseDetection pod version once `pod install` runs.
public final class ExpoPoseDetectorModule: Module {
  private lazy var poseDetector: PoseDetector = {
    let options = PoseDetectorOptions()
    options.detectorMode = .singleImage
    return PoseDetector.poseDetector(options: options)
  }()

  public func definition() -> ModuleDefinition {
    Name("ExpoPoseDetector")

    AsyncFunction("detectPose") { (imageUri: String, promise: Promise) in
      let path = imageUri.hasPrefix("file://") ? String(imageUri.dropFirst("file://".count)) : imageUri
      guard let uiImage = UIImage(contentsOfFile: path) else {
        promise.reject("ERR_POSE_IMAGE_DECODE", "Could not decode image at \(imageUri)")
        return
      }

      let visionImage = VisionImage(image: uiImage)
      visionImage.orientation = uiImage.imageOrientation

      self.poseDetector.process(visionImage) { poses, error in
        if let error = error {
          promise.reject("ERR_POSE_DETECTION", error.localizedDescription)
          return
        }
        guard let pose = poses?.first else {
          promise.resolve(nil)
          return
        }
        promise.resolve(Self.serialize(pose))
      }
    }
  }

  // Keep in sync with src/motion/landmarks.ts POSE_LANDMARK_NAMES.
  private static let trackedLandmarks: [(PoseLandmarkType, String)] = [
    (.nose, "nose"),
    (.leftShoulder, "left_shoulder"),
    (.rightShoulder, "right_shoulder"),
    (.leftElbow, "left_elbow"),
    (.rightElbow, "right_elbow"),
    (.leftWrist, "left_wrist"),
    (.rightWrist, "right_wrist"),
    (.leftHip, "left_hip"),
    (.rightHip, "right_hip"),
    (.leftKnee, "left_knee"),
    (.rightKnee, "right_knee"),
    (.leftAnkle, "left_ankle"),
    (.rightAnkle, "right_ankle"),
  ]

  private static func serialize(_ pose: Pose) -> [String: Any] {
    var landmarks: [String: Any] = [:]
    for (type, name) in trackedLandmarks {
      let lm = pose.landmark(ofType: type)
      landmarks[name] = [
        "x": lm.position.x,
        "y": lm.position.y,
        "z": lm.position.z,
        "inFrameLikelihood": lm.inFrameLikelihood,
      ]
    }
    return ["landmarks": landmarks]
  }
}
