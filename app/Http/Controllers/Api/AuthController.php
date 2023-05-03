<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignUpRequest;
use App\Models\User;
use App\Traits\HttpResponse;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    use HttpResponse;

    public function signup(SignUpRequest $request)
    {

        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return $this->error([
                'message'=>'Provided email or password is incorrect'
            ],422);
            // return response([
            //     'errors' => ['message'=>'Provided email or password is incorrect']
            // ],422);
        }

        $user = Auth::user();
        $token =  $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }


    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user)
            $user->currentAccessToken()->delete();
        return response('', 204);
    }
}
