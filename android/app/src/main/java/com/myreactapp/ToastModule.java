package com.myreactapp;

import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;
import java.util.Map;

public class ToastModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public ToastModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "ToastModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @ReactMethod
    public void showCb(String message, int duration,
            Callback errorCallback,
            Callback successCallback) {
        if (duration > 0) {
            successCallback.invoke(1,2,3,4);
        } else {
            errorCallback.invoke("error");
        }
    }

    @ReactMethod
    public void showAsync(String message, int duration, Promise promise) {
//        Toast.makeText(getReactApplicationContext(), message, duration).show();

        WritableMap map = Arguments.createMap();

        map.putDouble("relativeX", 1);
        map.putDouble("relativeY", 2);
        map.putDouble("width", 3);
        map.putDouble("height", 4);

        promise.resolve(map);
    }

}
