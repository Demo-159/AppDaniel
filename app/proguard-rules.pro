# kotlinx.serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.**
-keepclassmembers class kotlinx.serialization.json.** { *** Companion; }
-keepclasseswithmembers class kotlinx.serialization.json.** { kotlinx.serialization.KSerializer serializer(...); }
-keep,includedescriptorclasses class com.appdaniel.rutab.**$$serializer { *; }
-keepclassmembers class com.appdaniel.rutab.** { *** Companion; }
-keepclasseswithmembers class com.appdaniel.rutab.** { kotlinx.serialization.KSerializer serializer(...); }
