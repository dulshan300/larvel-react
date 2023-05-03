<?php
namespace App\Traits;

trait HttpResponse
{
    public function success($data = [], $message = "Success", $code = 200)
    {
        return response([
            'message' => $message,
            'data' => $data
        ], $code);
    }
    public function error($data = [], $code)
    {
        return response([
            'message' => "Error",
            'errors' => $data
        ], $code);
    }
}
