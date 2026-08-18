require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoPoseDetector'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = 'Alarm Battles'
  s.homepage       = 'https://github.com/alarmbattles/alarm-battles'
  s.platforms      = { :ios => '15.1' }
  s.source         = { :git => '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  # ML Kit's pose detector; swap for GoogleMLKit/PoseDetectionAccurate if the
  # bundled ("fast") model proves too jittery for the loose thresholds in
  # src/motion/repCounter.ts once tested on-device.
  s.dependency 'GoogleMLKit/PoseDetection'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{h,m,swift}'
end
