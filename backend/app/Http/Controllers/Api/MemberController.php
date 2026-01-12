<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\Transaksi;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 5);
        $search = $request->input('search', '');

        $query = DB::table('tbl_member as m')
            ->leftJoin('tbl_transaksi as trx', 'm.id_member', '=', 'trx.id_member') // Join tabel transaksi
            ->select(
                'm.id_member',
                'm.nama_member',
                'm.alamat',
                'm.nomor_telepon',
                'm.updated_at',
                DB::raw('DATE_FORMAT(MAX(trx.tanggal_transaksi), "%d-%m-%Y") as tanggal_terakhir'), // Tanggal terakhir transaksi
                DB::raw('(SELECT trx.catatan FROM tbl_transaksi as trx 
                      WHERE trx.id_member = m.id_member 
                      AND trx.tanggal_transaksi = 
                          (SELECT MAX(tanggal_transaksi) 
                           FROM tbl_transaksi as trx
                           WHERE trx.id_member = m.id_member) 
                      LIMIT 1) as catatan_terakhir') // Catatan dari transaksi terakhir
            )
            ->groupBy('m.id_member', 'm.nama_member', 'm.alamat', 'm.nomor_telepon', 'm.updated_at') // Grup berdasarkan member
            ->orderBy('m.updated_at', 'desc');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('m.nama_member', 'like', "%$search%")
                    ->orWhere('m.id_member', 'like', "%$search%")
                    ->orWhere('m.nomor_telepon', 'like', "%$search%");
            });
        }

        $members = $query->paginate($limit);

        return response()->json(
            $members
        );
    }

    public function store(Request $request)
    {
        $id_member = substr(md5(uniqid()), 0, 7);
        $number = $request->nomor_telepon;

        $phone = preg_replace('/[^0-9]/', '', $number);

        if (str_starts_with($phone, '628')) {
            $phone = '0' . substr($phone, 3);
        } elseif (str_starts_with($phone, '62')) {
            $phone = '0' . substr($phone, 2);
        }

        if (strlen($phone) < 11 && !str_starts_with($phone, '0')) {
            $phone = '0' . $phone;
        }

        $member = Member::insert([
            'id_member' => $id_member,
            'nama_member' => $request->nama_member,
            'alamat' => $request->alamat,
            'nomor_telepon' => $phone,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(
            $member
        );
    }

    public function update(Request $request, $id)
    {
        $number = $request->nomor_telepon;

        $phone = preg_replace('/[^0-9]/', '', $number);

        if (str_starts_with($phone, '628')) {
            $phone = '0' . substr($phone, 3);
        } elseif (str_starts_with($phone, '62')) {
            $phone = '0' . substr($phone, 2);
        }

        if (strlen($phone) < 11 && !str_starts_with($phone, '0')) {
            $phone = '0' . $phone;
        }

        $member = Member::where('id_member', $id)
            ->update([
                'nama_member' => $request->nama_member,
                'alamat' => $request->alamat,
                'nomor_telepon' => $phone,
                'updated_at' => now()
            ]);

        return response()->json(
            $member
        );
    }

    public function destroy($id)
    {
        $member = Member::where('id_member', $id)
            ->delete();

        $transaksi = Transaksi::where('id_member', $id)->get();

        foreach ($transaksi as $t) {
            $transakaksi = Transaksi::where('id_transaksi', $t->id_transaksi)->update([
                'id_member' => null
            ]);
        }

        $UD = DB::table('tbl_unit_terdaftar')
            ->where('id_member', $id)->delete();

        return response()->json(
            $member
        );
    }

    public function transaksiMember(Request $request)
    {
        $id_member = $request->input('id_member');
        $transaksi = DB::table('tbl_transaksi')->where('id_member', $id_member)->orderBy('tanggal_transaksi', 'desc')->paginate(10);

        return response()->json(
            $transaksi
        );
    }
}
